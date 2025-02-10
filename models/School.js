import mongoose from "mongoose";

const { Schema } = mongoose;

const schoolSchema = new Schema({
  schoolName: String,
  address: String,
  email: String,
  noOfStudents: Number,
  address: String,
  phone: String,
  document: String,
  quantities: String,
  type: String,
});
// save updated info
// request resource
// save quantities, resource type

const School = mongoose.model("School", schoolSchema);
export default School;
