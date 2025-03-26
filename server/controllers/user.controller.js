const { comparePassword } = require('../helpers/bcrypt');
const { generateToken } = require('../helpers/jwt');
const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');

class UserController {
  static async googleLogin(req, res, next) {
    try {
      const { token } = req.body;

      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();

      const [userInstance, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          email: payload.email,
          password: `${require('crypto').randomBytes(20).toString('hex')}`,
          firstName: payload.given_name,
          lastName: payload.family_name,
          profilePicture: payload.picture
        }
      });

      const access_token = generateToken({ id: userInstance['id'] });

      res.status(200).json({ access_token, firstName: userInstance['firstName'], lastName: userInstance['lastName'], profilePicture: userInstance['profilePicture'] });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body

      const user = await User.create({ email, password, firstName, lastName });

      const { password: _, createdAt, updatedAt, ...userSecured } = user.get({ plain: true });

      res.status(201).json(userSecured);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: 'BadRequest', message: 'Email is required.' };
      }

      if (!password) {
        throw { name: 'BadRequest', message: 'Password is required.' };
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        throw { name: 'Unauthorized', message: 'Email or password is incorrect' };
      }

      const isValidPassword = comparePassword(password, user['password']);

      if (!isValidPassword) {
        throw { name: 'Unauthorized', message: 'Email or password is incorrect' };
      }

      const access_token = generateToken({ id: user['id'] });

      res.status(200).json({ access_token, firstName: user['firstName'], lastName: user['lastName'], profilePicture: user['profilePicture'] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;