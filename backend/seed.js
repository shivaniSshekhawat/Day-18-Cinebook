const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ShowModel = require("./models/Show");

const shows = [
  {
    title: "Interstellar",
    posterUrl: "/assets/interstellar.jpg",
    screen: "Screen 1",
    startTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    seats: [
      "A1", "A2", "A3", "A4", "A5",
      "B1", "B2", "B3", "B4", "B5",
      "C1", "C2", "C3", "C4", "C5"
    ],
    pricing: { A: 500, B: 300, C: 200 },
    currency: "INR"
  },
  {
    title: "Inception",
    posterUrl: "/assets/inception.png",
    screen: "Screen 2",
    startTime: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // Day after tomorrow
    seats: [
      "A1", "A2", "A3", "A4", "A5",
      "B1", "B2", "B3", "B4", "B5",
      "C1", "C2", "C3", "C4", "C5"
    ],
    pricing: { A: 450, B: 250, C: 150 },
    currency: "INR"
  },
  {
    title: "The Dark Knight",
    posterUrl: "/assets/dark_knight.jpg",
    screen: "IMAX",
    startTime: new Date(new Date().getTime() + 12 * 60 * 60 * 1000), // In 12 hours
    seats: [
      "A1", "A2", "A3", "A4", "A5",
      "B1", "B2", "B3", "B4", "B5",
      "C1", "C2", "C3", "C4", "C5"
    ],
    pricing: { A: 600, B: 400, C: 300 },
    currency: "INR"
  }
];

mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    console.log("Connected to DB. Seeding Shows...");
    await ShowModel.deleteMany({});
    await ShowModel.insertMany(shows);
    console.log("Shows seeded successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    mongoose.connection.close();
  });
