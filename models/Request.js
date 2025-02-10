import mongoose from "mongoose";

const { Schema } = mongoose;

const requestSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "cancel"],
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);
export default Request;
