const express = required("express");
const app = express();

app.use("/", () => {
  console.log("You are here");
});

const port = 3000;
app.listen(port, () => {
  console.log("Server running at http://localhost:${port}");
});
