import Joi from "joi";

const profileSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .messages({ "any.required": "Phone number required" }),

  address: Joi.string()
    .required()
    .messages({ "any.required": "Address required" }),

  noOfStudents: Joi.number()
    .required()
    .messages({ "any.required": "Address required" }),
});

export default profileSchema;
