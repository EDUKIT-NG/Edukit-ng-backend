// import School from "../../models/School.js";
// export const deleteSchool = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let school = School.findById(id);
//     if (!school) {
//       return res.status(404).json({ message: "school not found" });
//     }
//     await School.findOneAndDelete(id);

//     res.status(200).json({ message: "school deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
