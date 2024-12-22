const router = require("express").Router();
const { me } = require("./controller");
const token = require("../../middlewares/auth");

router.get("/me", token.tokenCheck, me);

module.exports = router;
