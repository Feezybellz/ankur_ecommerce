const AuthMiddleware = require("./AuthMiddleware");

const AdminAuthMiddleware = async (req, res, next) => {
  try {
    await AuthMiddleware(req, res, next);

    const user = req.user;
    console.log(user);

    if (!["admin", "super_admin"].includes(user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = AdminAuthMiddleware;
