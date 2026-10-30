const dns = require("dns");


dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors());
app.use(express.json());

 app.use("/api/auth", authRoutes);
 app.use("/api/rentals", rentalRoutes);
 app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Rentzo Backend is running 🚀"
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully ✅");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  });

