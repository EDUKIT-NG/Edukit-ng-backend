import mongoose from "mongoose";

const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    // phone: { type: String, required: true },
    password: { type: String, required: true, min: 8, max: 12 },
    // address: { type: String, required: true },
    // moneyReceived: { type: Number, default: 0 },
    // requestReceived: { type: Number, default: 0 },
    // noOfStudents: { type: Number, default: 0 },
    // document: String,
    // quantities: { type: Number, required: true },
    // type: { type: String, enum: ["public", "private", "community school"] },
    // location: { type: String, enum: ["state", "local government area"] },
    isVerified: { type: Boolean, default: false },
    // isDeleted: { type: Boolean, default: false },
    // role: {
    //   type: String,
    //   default: "school",
    //   enum: ["donor", "student", "sponsor", "admin", "school", "volunteer"],
    // },
  },
  { timestamps: true }
);
// save updated info
// request resource
// save quantities, resource type

const School = mongoose.model("School", schoolSchema);
export default School;
