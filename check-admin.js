require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/usermodel");

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Database:", mongoose.connection.name);

    const user = await User.findOne({
      email: "Takecareadmin@gamil.com",
    });

    console.log("Admin found:", user ? "YES" : "NO");

    if (user) {
      console.log({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
  } catch (error) {
    console.error("ERROR:", error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAdmin();