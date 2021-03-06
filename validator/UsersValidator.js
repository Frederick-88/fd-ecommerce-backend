const jwt = require("jsonwebtoken");
require("dotenv").config();
const privateKey = process.env.PRIVATE_KEY;

module.exports.validateUser = (req, res, next) => {
  jwt.verify(req.headers["x-access-token"], privateKey, (err, decoded) => {
    if (err) {
      res.status(401).json({
        ...err,
        message: "Sorry, it seems you haven't login. Try login again.",
      });
    } else {
      // validation so that user id of the user is same with the id user of the token.
      // decoded = decode si token dan dapatkan id dari si payload di controller.
      req.userId = decoded.id;
      next();
    }
  });
};

module.exports.validateAdmin = (req, res, next) => {
  jwt.verify(req.headers["x-access-token"], privateKey, (err, decoded) => {
    //   first, to delete you need to provide token. if no token nothing happen and will show (500 error).
    //   second, when you have token, the only token that can do the thing is only the token of admin.
    //   to validate admin is myself.
    if (decoded.email == "admin@gmail.com" && !err) {
      req.userId = decoded.id;
      next();
    } else {
      res.status(401).json({
        ...err,
        message: "Sorry, you're not an admin.",
      });
    }
  });
};
