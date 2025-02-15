const express = require("express");
const {
  register,
  login,
  logout,
} = require("../controllers/UserAuthController");
const AuthMiddleware = require("../controllers/AuthMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/dashboard", AuthMiddleware, (req, res) => {
  res.json({ message: "Dashboard" });
});

module.exports = router;
