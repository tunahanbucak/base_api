const joi = require("joi");
const APIError = require("../../utils/errors");

class authValidation {
  constructor() {}

  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().trim().min(3).max(10).required().messages({
            "string.base": "Isim alani normal metin olmalidir",
            "string.empty": "Isim alani bos olamaz",
            "string.min": "Isim alani en az 3 karakter olmalidir",
            "string.max": "Isim alani en fazla 10 karakter olmalidir",
            "string.required": "Isim alani zorunludur",
          }),
          lastname: joi.string().trim().min(3).max(10).required().messages({
            "string.base": "Soyisim alani normal metin olmalidir",
            "string.empty": "Soyisim alani bos olamaz",
            "string.min": "Soyisim alani en az 3 karakter olmalidir",
            "string.max": "Soyisim alani en fazla 10 karakter olmalidir",
            "string.required": "Soyisim alani zorunludur",
          }),
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(20)
            .required()
            .messages({
              "string.base": "Email alani normal metin olmalidir",
              "string.empty": "Email alani bos olamaz",
              "string.min": "Email alani en az 3 karakter olmalidir",
              "string.email": "Lutfen gecerli bir email giriniz",
              "string.max": "Email alani en fazla 20 karakter olmalidir",
              "string.required": "Email alani zorunludur",
            }),
          password: joi.string().trim().min(6).max(10).required().messages({
            "string.base": "Sifre alani normal metin olmalidir",
            "string.empty": "Sifre alani bos olamaz",
            "string.min": "Sifre alani en az 6 karakter olmalidir",
            "string.max": "Sifre alani en fazla 10 karakter olmalidir",
            "string.required": "Sifre alani zorunludur",
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message)
        throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lutfen validasyon kurallarina uyunuz", 400);
    }
    next();
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(20)
            .required()
            .messages({
              "string.base": "Email alani normal metin olmalidir",
              "string.empty": "Email alani bos olamaz",
              "string.min": "Email alani en az 3 karakter olmalidir",
              "string.email": "Lutfen gecerli bir email giriniz",
              "string.max": "Email alani en fazla 20 karakter olmalidir",
              "string.required": "Email alani zorunludur",
            }),
          password: joi.string().trim().min(6).max(10).required().messages({
            "string.base": "Sifre alani normal metin olmalidir",
            "string.empty": "Sifre alani bos olamaz",
            "string.min": "Sifre alani en az 6 karakter olmalidir",
            "string.max": "Sifre alani en fazla 10 karakter olmalidir",
            "string.required": "Sifre alani zorunludur",
          }),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message)
        throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lutfen validasyon kurallarina uyunuz", 400);
    }
    next();
  };
}

module.exports = authValidation;
