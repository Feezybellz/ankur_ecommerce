const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Session = require("../models/Session");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    const response = {
      status: "error",
      message: "Authentication required",
    };
    return res.status(401).json(response);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const response = {
        status: "error",
        message: "User not found",
      };

      return res.status(404).json(response);
    }

    // Check if session exists and is still valid
    const session = await Session.findOne({ token: token });
    if (!session || new Date() > new Date(session.expiresAt)) {
      const response = {
        status: "error",
        message: "Session expired",
      };
      return res.status(401).json(response);
    }

    req.user = { id: user._id, email: user.email, role: user.role };

    next();
  } catch (error) {
    const response = {
      status: "error",
      message: "Authentication failed",
    };
    return res.status(401).json(response);
  }
};

module.exports = authMiddleware;
