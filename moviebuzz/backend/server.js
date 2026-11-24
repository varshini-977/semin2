
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to local MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/MovieBuzz")
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.send("MovieBuzz Backend is Working!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
