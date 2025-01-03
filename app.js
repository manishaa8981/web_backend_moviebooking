const express = require("express");
const connectDB = require("./config/db");
const CustomerRoute = require("./routes/CustomerRoute");

connectDB();
const app = express();

app.use(express.json());

app.use("/api/customer", CustomerRoute);

const port = 4011;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
