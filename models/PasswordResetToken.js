import mongoose from "mongoose";

const { Schema } = mongoose;

const passwordResetTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: "Student" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  passwordResetTokenSchema
);
export default PasswordResetToken;
