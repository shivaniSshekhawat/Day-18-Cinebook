const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("DB_URL is not defined in environment variables");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("Connected to DB Successfully!!!");
    })
    .catch((err) => console.error(err));
}

