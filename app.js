const express = require("express");
const connectDB = require("./config/db");
const CustomerRoute = require("./routes/CustomerRoute");
const LocationRoute = require("./routes/LocationRoute");
const MovieRoute = require("./routes/MovieRoute");
const SeatRoute = require("./routes/SeatRoute");
const ShowTimeRoute = require("./routes/ShowTimeRoute");
const ThreaterRoute = require("./routes/ThreaterRoute");
const AudiRoute = require("./routes/AudiRoute");
const BookingRoute = require("./routes/BookingRoute");

connectDB();
const app = express();

app.use(express.json());

app.use("/api/customer", CustomerRoute);
app.use("/api/location", LocationRoute);
app.use("/api/movie", MovieRoute);
app.use("/api/seat", SeatRoute);
app.use("/api/showTime", ShowTimeRoute);
app.use("/api/audi", AudiRoute);
app.use("/api/threater", ThreaterRoute);
app.use("/api/booking", BookingRoute);

const port = 4011;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
