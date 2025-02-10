import mongoose, { mongo } from "mongoose";

const { Schema } = mongoose;

const donarSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: {type: String, required: true},
    password: { type: String, required: true, min: 8, max: 12 },
    description: { type: String },
    address: { type: String, required: true },
    paymentType: {
      resourceType: { type: String, required: true },
      default: "bank",
      enum: ["bank", "credit", "mobile"],
    },
    quantities: { type: Number, required: true },
    condition: { type: String },
    pickup: { type: String, default: "delivery", enum: ["pickup", "delivery"] },
    moneySend: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    role: {
      type: String,
      default: "student",
      enum: ["donor", "sponsor", "student", "admin", "school", "volunteer"],
    },
  },
  { timestamps: true }
);

// saves donates in the db
// donar can donate without creating an account

const Donar = mongoose.model("Donar", donarSchema);
export default Donar;
