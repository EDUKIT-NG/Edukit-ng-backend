// export const EditUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { email, password, name } = req.body;
//     let school = await School.findByIdAndUpdate(id, { email, password, name });
//     if (!school) {
//       return res.status(404).json({ message: "school not found" });
//     }
//     res.status(200).json({ message: "school updated successfully", school });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
