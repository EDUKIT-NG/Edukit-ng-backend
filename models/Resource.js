import mongoose from "mongoose";

const { Schema } = mongoose;

const resourceSchema = new Schema({
  totalResources: { type: Number, required: true },
  resourceStatus: { type: Number, enum: ["delivered", "shipped"] },
  resourceCategory: {
    type: String,
    enum: ["books", "uniform", "learning resources"],
  },
  quantities: { type: Number },
  resourceDescription: { type: String },
  resourceCondition: { type: String },
  deliveryOptions: { type: String, enum: ["pickup", "ship"] },
  deliveryAddress: { type: String, required: true },
});
// admin will view resources, transactions, users
// save updated admin database
//can generate reports

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
