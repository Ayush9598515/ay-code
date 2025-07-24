const mongoose = require('mongoose');

const DBConnection = async () => {
  const MONGO_URI = process.env.MONGO_URL; // ✅ Use correct key name as in .env

  if (!MONGO_URI) {
    console.error("❌ MONGO_URL not set in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI); // No need for `useNewUrlParser` etc in Mongoose 6+
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = { DBConnection };
