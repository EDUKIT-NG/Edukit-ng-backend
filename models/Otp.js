// OTP
const otpSchema = new Schema({
  otp: Number,
});
// expires after 120sec
// generate otp after clicking submit button on sign up
// resend otp when the other one has expired
// notifications send to user emails within 5 sec
// generate random otp numbers  4 in number
