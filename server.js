import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const port = process.env.PORT;
const db = process.env.MONGO_URI;

// connect to database
mongoose.connect(db, {}).then(() => {
  console.log("Connected to db");
});

app.get("/", (req, res) => res.send("Welcome!"));

app.listen(port, () => {
  console.log("Server running on port 5000");
});
