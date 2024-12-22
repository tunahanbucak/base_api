const APIError = require("../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof APIError) {
    return res.status(err.statusCode || 400).json({
      success: false,
      message: err.message,
    });
  }
  //if (err.name === "CastError") console.log("test");

  return res.status(500).json({
    success: false,
    message: "Bir hata ile karsilastik lutfen apinizi kontrol edin",
  });
};

module.exports = errorHandlerMiddleware;
