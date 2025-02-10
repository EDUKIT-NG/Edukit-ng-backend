import mongoose from "mongoose";

const { Schema } = mongoose;

const requestSchema = new Schema({
  status: ["delivered", "shipped", "pending", "picked", "distributed"],
});

const Request = mongoose.model("Request", requestSchema);
export default Request;
