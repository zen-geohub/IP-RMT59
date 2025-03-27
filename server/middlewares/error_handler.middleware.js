function errorHandler(error, req, res, next) {
  console.log(error, '<<<<')

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const data = error['errors'].reduce((acc, { path, message }) => {
      acc[path] = message;

      return acc;
    }, {});
    return res.status(400).json(data);
  }

  if (error.name === 'NotFound') {
    return res.status(404).json({ message: error.message });
  }

  if (error.name === "Forbidden") {
    return res.status(403).json({ message: error.message });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token." });
  }

  if (error.name === 'BadRequest') {
    return res.status(400).json({ message: error.message })
  }

  if (error.name === 'Unauthorized') {
    return res.status(401).json({ message: error.message })
  }

  res.status(500).json({ message: 'Internal server error' });
}

module.exports = errorHandler;