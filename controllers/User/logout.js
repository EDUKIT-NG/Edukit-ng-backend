// const logoutSchool = (req, res) => {
//   try {
//     res.cookie("token", "", {
//       sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
//       maxAge: 0,
//       httpOnly: true,
//       secure: process.env.PRODUCTION === "true",
//     });
//     return res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export default logoutSchool;
