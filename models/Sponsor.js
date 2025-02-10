import mongoose from "mongoose";

const { Schema } = mongoose;

const sponsorSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
export default Sponsor;
