import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/Student.js";

const app = express();

const port = process.env.PORT;
const db = process.env.MONGO_URI;

// connect to database
mongoose
  .connect(db, {})
  .then(() => {
    console.log("Connected to db");
  })
  .catch((error) => {
    console.error(error);
  });

// middleware
app.use(express.json());

// allow all API calls coming from the frontend to get to the server
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use("/students", router);

app.listen(port, () => {
  console.log("Server running on port 5000");
});
