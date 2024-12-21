const jwt = require("jsonwebtoken");
const APIError = require("../utils/errors");
const user = require("../models/user.model");

const createToken = async (user, res) => {
  const payload = {
    sub: user._id,
    name: user.name,
  };

  const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    algorithm: "HS512",
    expiresIn: process.env.JWT_EXPIRES_IN, //token suresi
  });

  return res.status(201).json({
    success: true,
    token,
    message: "Basarili",
  });
};

const tokenCheck = async (req, res, next) => {
  const headerToken =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer");

  if (!headerToken)
    throw new APIError("Gecersiz oturum. Lutfen oturum aciniz", 401);

  const token = req.headers.authorization.split(" ")[1]; // tokenin bearer tarafini almamak icin [1] yazdik

  console.log(token);

  // sifrelenmis tokeni cozmek icin
  await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) throw new APIError("Gecersiz token", 401);

    const userInfo = await user
      .findById(decoded.sub)
      .select(" _id name lastname email"); //bizim istedigimiz bilgileri getirsin

    console.log(userInfo);
    if (!userInfo) throw new APIError("Gecersiz token", 401);

    req.user = userInfo;
    next();
  });
};

module.exports = {
  createToken,
  tokenCheck,
};
