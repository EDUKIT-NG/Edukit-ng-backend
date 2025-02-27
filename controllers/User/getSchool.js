// import School from "../../models/School.js";

// export const getAllSchools = async (req, res) => {
//   try {
//     let schools = await School.find({});
//     res.status(200).json(schools);
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getASingleSchool = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let school = await School.findById(id);
//     if (!school) {
//       return res.status(404).json({ message: "school not found" });
//     }
//     res.status(200).json({ school });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
