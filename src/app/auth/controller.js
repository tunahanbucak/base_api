const user = require("../users/model");
const bcrypt = require("bcrypt");
const APIError = require("../../utils/errors");
const Response = require("../../utils/response");
const {
  createToken,
  createTemporaryToken,
  decodedTemporaryToken,
} = require("../../middlewares/auth");
const crypto = require("crypto");
const moment = require("moment");

const login = async (req, res) => {
  const { email, password } = req.body;
  const userInfo = await user.findOne({ email });
  if (!userInfo) throw new APIError("email yada sifre hatalidir!", 401);

  const comparePassword = await bcrypt.compare(password, userInfo.password);
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

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const userInfo = await user.findOne({ email }).select("name lastname email");
  if (!userInfo) return new APIError("Gecersiz kullanici", 400);

  const resetCode = crypto.randomBytes(3).toString("hex");

  // await sendEmail({
  //   from: "base.api.proje@gmail.com",
  //   to: userInfo.email,
  //   subject: "Sifre sifirlama",
  //   text: `Sifre sifirlama kodunuz ${resetCode}`,
  // });

  await user.updateOne(
    { email },
    {
      reset: {
        code: resetCode,
        time: moment(new Date())
          .add(15, "minute")
          .format("YYYY-MM-DD HH:mm:ss"),
      },
    }
  );

  return new Response(true, "Lutfen mail kutunuzu kontrol ediniz").success(res);
};

const resetCodeCheck = async (req, res) => {
  const { email, code } = req.body;
  const userInfo = await user
    .findOne({ email })
    .select("_id name lastname email reset");
  if (!userInfo) throw new APIError("Gecersiz kod!", 401);

  const dbTime = moment(userInfo.reset.time);
  const nowTime = moment(new Date());

  const timeDiff = dbTime.diff(nowTime, "minutes");
  if (timeDiff <= 0 || userInfo.reset.code !== code)
    throw new APIError("gecersiz kod", 401);

  const temporaryToken = await createTemporaryToken(
    userInfo._id,
    userInfo.email
  );

  return new Response(
    { temporaryToken },
    "Sifre sifirlama yapabilirsiniz"
  ).success(res);
};

const resetPassword = async (req, res) => {
  const { password, temporaryToken } = req.body;
  const decodedToken = await decodedTemporaryToken(temporaryToken);
  const hashPassword = await bcrypt.hash(password, 10);

  await user.findByIdAndUpdate(
    {
      _id: decodedToken._id,
    },
    {
      reset: {
        code: null,
        time: null,
      },
      password: hashPassword,
    }
  );

  return new Response(decodedToken, "Sifre sifirlama basarili").success(res);
};

module.exports = {
  login,
  register,
  forgetPassword,
  resetCodeCheck,
  resetPassword,
};
