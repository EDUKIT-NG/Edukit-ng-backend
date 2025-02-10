import mongoose from "mongoose";

const { Schema } = mongoose;

const volunteerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  skills: String,
  role: ["collection", "sorting", "distribution"],
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
export default Volunteer;

// access the dashboard
