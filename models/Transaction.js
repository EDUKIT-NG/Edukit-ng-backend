import mongoose from "mongoose";

const { Schema } = mongoose;

const currencySchema = new Schema({
  currency: ["$", "KSHs"],
  amount: Number,
  minAmount: String,
});

const transactionsSchema = new Schema({
  send: Number,
});
// transactions are saved on the db either received or sent
// after saving a transaction generate a receipt and send it to the user

const Transactions = mongoose.model("Transactions", transactionsSchema);
export default Transactions;
