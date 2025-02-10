import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema({
  total: Number,
  status: ["delivered", "shipped"],
  needsCategory: ["books", "uniform", "learning resources"],
  quantities: Number,
  description: String,
  condition: String,
  methodOfDelivery: ["pickup", "ship"],
  pickUpDetails: String,
});
// admin will view resources, transactions, users
// save updated admin database
//can generate reports

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
