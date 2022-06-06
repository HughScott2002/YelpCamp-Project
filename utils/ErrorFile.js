//Custom Express Error Class
class ExpressError extends Error {
  //Extends the Error class
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
