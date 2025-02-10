import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: Number, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  address: String,
  schoolName: String,
  class: Number,
  schoolType: ["public", "private", "community school"],
  schoolLocation: ["state", "local government area"],
  schoolContact: String,
  parentOccupation: String,
  noOfSiblings: Number,
  resourceNeed: String,
  reason: String,
  otherSupport: ["scholarships", "donations"],
  supportReceived: String,
  whyConsidered: String,
  howResourceWillHelp: String,
  communityContribution: String,
  goals: String,
  otherInfo: String,
});
// save updated students info
// can view resources, request a resource, join communities, chat
// validation

const Student = mongoose.model("Student", studentSchema);
export default Student;
