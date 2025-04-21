import mongoose from "mongoose";

const { Schema } = mongoose;

const passwordResetTokenSchema = new Schema({
  user: {
    id: { type: Schema.Types.ObjectId, required: true, refPath: "userType" },
    userType: {
      type: String,
      required: true,
      enum: ["student", "volunteer", "donor", "school", "admin", "sponsor"],
    },
  },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  passwordResetTokenSchema
);

export default PasswordResetToken;
