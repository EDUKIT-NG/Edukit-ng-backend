import Joi from "joi";

const logInSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "any.required": "Email is required",
      "string.email": "Invalid email format",
    }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export default logInSchema;
