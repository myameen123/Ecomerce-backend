const ErrorHandler = require("../utils/ErrorHandling");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Rescource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  //Mogoose duplicate key error
  if (err.code == 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }
  //wrong jwt error
  if (err.name === "jsonWebTokenError") {
    const message = `Json web token is Invalid, please try again`;
    err = new ErrorHandler(message, 400);
  }
  //wrong jwt expire
  if (err.name === "jsonWebExpireError") {
    const message = `Json web token is Expired, please try again`;
    err = new ErrorHandler(message, 400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
