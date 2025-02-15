require("dotenv").config();

module.exports.createAdminUser = async function () {
  try {
    const User = require("../models/User");
    if (await User.userExists(process.env.SUPER_ADMIN_EMAIL)) {
      const user = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
      if (user.role === "super_admin") {
        return;
      } else {
        user.role = "super_admin";
        await user.save();
        return;
      }
    }
    const user = new User({
      name: process.env.SUPER_ADMIN_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      password: process.env.SUPER_ADMIN_PASSWORD,
      role: "super_admin",
    });
    await user.save();
    console.log("Super Admin Created");
  } catch (error) {
    console.error("Error Creating Super Admin:", error);
  }
};
