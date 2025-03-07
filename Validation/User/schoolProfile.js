import Joi from "joi";

const profileSchema = Joi.object({
  phone: Joi.string()
    .required()
    .messages({ "any.required": "Phone number required" }),

  address: Joi.string()
    .required()
    .messages({ "any.required": "Adress required" }),

  noOfStudents: Joi.number()
    .required()
    .messages({ "any.required": "Adress required" }),
});

export default profileSchema;
