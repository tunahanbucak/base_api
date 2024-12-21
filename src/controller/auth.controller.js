const user = require("../models/user.model");
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middlewares/auth");

const login = async (req, res) => {
  console.log("login");
  const { email, password } = req.body;

  const userInfo = await user.findOne({ email });

  console.log(userInfo);

  if (!userInfo) throw new APIError("email yada sifre hatalidir!", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);
  console.log(comparePassword);

  if (!comparePassword) throw new APIError("email yada sifre hatalidir!", 401);

  createToken(userInfo, res);
};

const register = async (req, res) => {
  const { email } = req.body;
  const userCheck = await user.findOne({ email });

  if (userCheck) {
    throw new APIError("Girmis oldugunuz email kullanilmis!", 401);
  }

  req.body.password = await bcrypt.hash(req.body.password, 10);

  console.log("hash sifre:", req.body.password);
  const userSave = new user(req.body);
  await userSave
    .save()
    .then((data) => {
      return new Response(data, "Kayit basariyla eklendi").created(res);
    })
    .catch((err) => {
      throw new APIError("Kullanici kayit edilemedi!", 400);
    });
};

const me = async (req, res) => {
  return new Response(req.user).success(res);
};

module.exports = {
  login,
  register,
  me,
};
