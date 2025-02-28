import Joi from "joi";

const studentProfileSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .messages({ "any.required": "Phone number required" }),
  grade: Joi.string().required().messages({ "any.required": "Grade required" }),
  studentSchool: Joi.string()
    .required()
    .messages({ "any.required": "School name required" }),
});

export default studentProfileSchema;
