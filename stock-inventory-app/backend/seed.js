const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("dotenv").config();

const seedAdmin = async () => {
  try {

    await mongoose.connect(process.env.DBURL);
    console.log("Database Connected");

    const password = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: password,
      address: "Admin Address",
      role: "admin"
    });

    console.log("Admin user created");

    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();