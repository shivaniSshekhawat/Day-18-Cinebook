const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  showId: mongoose.Schema.Types.ObjectId,
  seats: [String],
  amount: Number,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});

const BookingsModel = mongoose.model("Booking", bookingSchema);

module.exports = BookingsModel;
