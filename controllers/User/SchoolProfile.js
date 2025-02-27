// import School from "../../models/School.js";
// import profileSchema from "../../Validation/school/schoolProfile.js";

// export const createProfile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const result = await profileSchema.validateAsync(req.body);

//     const school = await School.findById(id);
//     if (!school) {
//       return res.status(404).json({ message: "school not found" });
//     }

//     const schoolData = await School.findByIdAndUpdate(
//       id,
//       { $set: result },
//       { new: true }
//     );
//     return res
//       .status(201)
//       .json({ message: "Profile created successfully", schoolData });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
