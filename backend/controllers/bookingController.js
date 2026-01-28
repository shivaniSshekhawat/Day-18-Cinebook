const redis = require("../config/redisClient");
const BookingsModel = require("../models/Bookings");
const ShowModel = require("../models/Show");

const createBooking = async (req, res, next) => {
  try {
    const { seats, showId } = req.body;

    const show = await ShowModel.findById(showId);
    let totalAmount = 0;

    seats.forEach((seat) => {
      const seatRow = seat[0];
      const price = show.pricing[seatRow];
      totalAmount += price;
    });

    const lockedKey = `locked_seats:${showId}`;
    const availableKey = `available_seats:${showId}`;

    const booking = await BookingsModel.create({
      showId,
      seats,
      amount: totalAmount,
    });

    // Remove seats from available set and locked set
    await redis.sRem(availableKey, seats);
    await redis.sRem(lockedKey, seats);

    res.send({ success: true, bookingId: booking._id, message: "Booking confirmed successfully!" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
};
