const bcrypt = require('bcrypt');

function hashPassword(password) {
  if (!password) {
    throw new Error('Password must not be null or empty');
  }
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const comparePassword = (password, hash) => {
  if (!password) {
    throw new Error('Password must not be null or undefined');
  }
  if (!hash) {
    throw new Error('Hash must not be null or undefined');
  }
  return bcrypt.compareSync(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};