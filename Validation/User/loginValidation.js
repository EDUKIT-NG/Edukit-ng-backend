import Joi from "joi";

const logInSchema = Joi.object({
  email: Joi.string()
    .required()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ng"] },
    })
    .messages({
      "any.required": "Email is required",
    }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export default logInSchema;
