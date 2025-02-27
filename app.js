const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
app.use(express.json());

// Enable CORS
const cors = require("cors");
app.use(cors());

// Import Routes
const CustomerRoute = require("./routes/CustomerRoute");
const MovieRoute = require("./routes/MovieRoute");
const SeatRoute = require("./routes/SeatRoute");
const ShowTimeRoute = require("./routes/ShowTimeRoute");
const HallRoute = require("./routes/HallRoute");
const BookingRoute = require("./routes/BookingRoute");
const AuthRoute = require("./routes/AuthRoute");
const paymentRoutes = require("./routes/paymentRoutes");


app.use("/api/customer", CustomerRoute);
app.use("/api/movie", MovieRoute);
app.use("/api/seat", SeatRoute);
app.use("/api/showtime", ShowTimeRoute);
app.use("/api/hall", HallRoute);
app.use("/api/booking", BookingRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/payment", paymentRoutes);


app.use("/public/uploads", express.static("public/uploads"));

const port = 4011;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
