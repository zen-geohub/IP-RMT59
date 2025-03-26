const { verifyToken } = require('../helpers/jwt');
const { User, UserPlace } = require('../models');

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      throw { name: 'Unauthorized', message: 'Invalid token.' };
    }

    const bearer = authorization.split(' ');
    
    if (bearer[0] !== 'Bearer' || !bearer[1]) {
      throw { name: 'Unauthorized', message: 'Invalid token.' };
    }
    
    const verify = verifyToken(bearer[1]);

    const user = await User.findByPk(verify['id']);
    if (!user) {
      throw { name: 'Unauthorized', message: 'Invalid token.' };
    }

    req.user = {
      id: user['id']
    }

    next();
  } catch (error) {
    next(error);
  }
}

async function authOwnership(req, res, next) {
  try {
    const { id } = req.params;
    const userPlace = await UserPlace.findByPk(id);

    if (!userPlace) {
      throw { name: 'NotFound', message: 'Place not found.' };
    }

    if (userPlace['UserId'] === req.user['id']) {
      next();
    } else {
      throw { name: 'Forbidden', message: 'You are not authorized.' };
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authentication,
  authOwnership
}