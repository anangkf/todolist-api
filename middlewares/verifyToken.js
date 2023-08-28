const jwt = require('jsonwebtoken');
const config = require(`${__config_dir}/app.config.json`);

const verifyToken = (req, res, next) => {
  try {
    const tokenFromRequest = req.header('Authorization').split(' ').pop();
    console.log({ tokenFromRequest, secret: config.jwt.publicKey });

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = verifyToken;
