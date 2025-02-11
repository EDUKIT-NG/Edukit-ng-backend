import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    password: { type: String, required: true, min: 8, max: 12 },
    additionalInfo: { type: Object, default: {} },
    // age: { type: Number, required: true },
    // gender: { type: String, required: true },
    // address: { type: String, required: true },
    // schoolName: { type: Schema.Types.ObjectId, required: true, ref: "School" },

    // schoolType: { type: Schema.Types.ObjectId, required: true, ref: "School" },
    // schoolLocation: {
    //   type: Schema.Types.ObjectId,
    //   required: true,
    //   ref: "School",
    // },
    // moneyReceived: { type: Number, default: 0 },
    // requestReceived: { type: Number, default: 0 },
    // isVerified: { type: Boolean, default: false },
    // isDeleted: { type: Boolean, default: false },
    // role: {
    //   type: String,
    //   default: "student",
    //   enum: ["student", "volunteer", "donor", "school", "admin", "sponsor"],
    // },
    // schoolContact: String,
    // parentOccupation: String,
    // noOfSiblings: Number,
    // resourceNeed: String,
    // reason: String,
    // otherSupport: ["scholarships", "donations"],
    // supportReceived: String,
    // whyConsidered: String,
    // howResourceWillHelp: String,
    // communityContribution: String,
    // goals: String,
    // otherInfo: String,
  },
  { timestamps: true }
);
// save updated students info
// can view resources, request a resource, join communities, chat
// validation

const Student = mongoose.model("Student", studentSchema);
export default Student;
