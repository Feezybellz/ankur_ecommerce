const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/UserAuthController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", AuthMiddleware, logout);

module.exports = router;
