import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const donarSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  address: String,
  role: "Donar",
  paymentDetails: String,
  quantities: String,
  description: String,
  condition: String,
  pickup: ["pickup", "delivery"],
  address: String,
  payment: ["credit", "bank", "mobile"],
  amount: Number,
});

const donateSchema = new Schema({
  address: String,
  paymentMethod: ["credit", "bank", "mobile"],
});
// saves donates in the db
// donar can donate without creating an account

const Donar = mongoose.model("Donar", donarSchema);
export default Donar;
