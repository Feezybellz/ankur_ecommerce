const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");
const inputValidator = require("../utils/inputValidator");
const { sendEmail } = require("../utils/email");

const generateVerificationLink = () => {
  const token = crypto.randomUUID();

  return {
    link: `${process.env.APP_PROTOCOL}://${process.env.APP_DOMAIN}/verify/${token}`,
    token: token,
  };
};

const sendVerificationEmail = async (name, email, verificationLink) => {
  const subject = "Verify Your Account";
  const text = `Hello ${name},\n\nPlease verify your account by clicking the link below:\n\n${verificationLink}\n\nIf you did not request this, please ignore this email.`;
  const html = ``;
  const emailSent = await sendEmail(email, subject, text, html);

  if (!emailSent) {
    throw new Error("Failed to send verification email");
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validator = new inputValidator();

    validator
      .withMessage("Email is required", "email")
      .notEmpty(email, "email")
      .withMessage("A valid email is required", "email")
      .isEmail(email, "email")
      .withMessage("Password is required", "password")
      .notEmpty(password, "password")
      .withMessage("Password length not be less than 8", "password")
      .minLength(password, 8, "password");

    if (!validator.isValid()) {
      const errors = validator.getErrors();
      return res
        .status(400)
        .json({ status: "error", message: "An error occured", errors });
    }

    const verificationData = generateVerificationLink();
    const verificationLink = verificationData.link;
    const verification_token = verificationData.token;

    if (await User.userExists(email)) {
      return res
        .status(400)
        .json({ status: "error", message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      verified: false,
      verification_token,
    });
    await user.save();
    //Uncomment this if you have a working SMTP credentials
    // await sendVerificationEmail(name, email, verificationLink);
    res.json({
      status: "success",
      message: "User registered successfully",
      /*user,*/
    });
  } catch (error) {
    const response = {
      status: "error",
      message: "An error occured",
    };
    if (process.env.APP_ENV === "development") {
      response.error_message = error.message;
    }
    res.status(500).json(response);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const session = new Session({
      userId: user.id,
      token: token,
      status: "active",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
    });
    await session.save();

    res.json({
      status: "success",
      token,
      /*user */
    });
  } catch (error) {
    const response = {
      status: "error",
      message: "An error occured",
    };
    if (process.env.APP_ENV === "development") {
      response.error_message = error.message;
    }
    res.status(500).json(response);
  }
};

exports.logout = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const response = {
      status: "error",
      message: "Token not provided",
    };
    return res.status(400).json(response);
  }

  try {
    // Delete session from database
    await Session.findOneAndDelete({ token: token });
    const response = {
      status: "success",
      message: "Logged out successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    const response = {
      status: "error",
      message: "An error occured",
    };
    if (process.env.APP_ENV === "development") {
      response.error_message = error.message;
    }
    res.status(500).json(response);
  }
};
