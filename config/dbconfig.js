const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined in the environment variables");
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("mongodb is connected");
    console.log("Connected database:", mongoose.connection.name);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = mongoose;