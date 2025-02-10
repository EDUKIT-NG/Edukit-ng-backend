import mongoose from "mongoose";

const { Schema } = mongoose;

const transactionsSchema = new Schema(
  {
    amount: { type: Number, required: true },
    sender: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
    type: { type: String, enum: ["credit", "debit", "mobile"], required: true },
    paymentMethod: {
      type: String,
      default: "bank",
      enum: ["credit", "bank", "mobile"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed"],
    },
    transactionId: { type: String },
    reference: {
      type: String,
      required: true,
      enum: ["transaction ID", "payment reference"],
    },
  },
  { timestamps: true }
);

// transactions are saved on the db either received or sent
// after saving a transaction generate a receipt and send it to the user

const Transactions = mongoose.model("Transactions", transactionsSchema);
export default Transactions;
