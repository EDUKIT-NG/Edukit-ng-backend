// import Otp from "../../models/Otp.js";
// import { generateOtp } from "../../utils/GenerateOtp.js";
// import bcrypt from "bcrypt";
// import { sendMail } from "../../utils/Email.js";
// import School from "../../models/School.js";

// const resendOtp = async (req, res) => {
//   try {
//     const { schoolId } = req.body;

//     const otp = await Otp.findOne({ "user.id": schoolId });
//     if (otp) {
//       await Otp.findByIdAndDelete(otp._id);
//     }

//     let new_otp = generateOtp();
//     let hashedOtp = await bcrypt.hash(new_otp, 10);
//     const newOtp = new Otp({
//       user: { id: schoolId, userType: "School" },
//       otp: hashedOtp,
//       expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME),
//     });
//     newOtp.save();
//     const school = await School.findById(schoolId);
//     if (!school) {
//       return res.status(400).json({ message: "School not found" });
//     }

//     await sendMail(
//       school.email,
//       "OTP Verification Code",
//       `Your OTP is: <b>${new_otp}</b>`
//     );
//     return res.status(200).json("Code sent successfully");
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export default resendOtp;
