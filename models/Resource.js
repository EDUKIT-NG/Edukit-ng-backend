import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema({
  total: { type: Number, required: true },
  status: { type: Number, enum: ["delivered", "shipped"] },
  category: {
    type: String,
    enum: ["books", "uniform", "learning resources"],
  },
  quantities: { type: Number },
  description: { type: String },
  condition: { type: String },
  delivery: { type: String, enum: ["pickup", "ship"] },
  address: { type: String, required: true },
});
// admin will view resources, transactions, users
// save updated admin database
//can generate reports

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
