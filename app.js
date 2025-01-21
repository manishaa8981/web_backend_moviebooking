const express = require("express");
const connectDB = require("./config/db");
const CustomerRoute = require("./routes/CustomerRoute");
const MovieRoute = require("./routes/MovieRoute");
const SeatRoute = require("./routes/SeatRoute");
const ShowTimeRoute = require("./routes/ShowTimeRoute");
const HallRoute = require("./routes/HallRoute");
const BookingRoute = require("./routes/BookingRoute");
const AuthRoute = require("./routes/AuthRoute");

const cors = require("cors");

connectDB();
const app = express();

app.use(express.json());

// Enable CORS for all origins
app.use(cors());

app.use("/api/customer", CustomerRoute);
app.use("/api/movie", MovieRoute);
app.use("/api/seat", SeatRoute);
app.use("/api/showTime", ShowTimeRoute);
app.use("/api/hall", HallRoute);
app.use("/api/booking", BookingRoute);
app.use("/api/auth", AuthRoute);

const port = 4011;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
