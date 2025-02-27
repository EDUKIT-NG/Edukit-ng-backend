import Joi from "joi";

const passwordResetSchema = Joi.object({
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .messages({
      "any.required": "Password required",
      "string.pattern.base":
        "Password must be at least 8 characters long and include a capital letter, a number, and a special character.",
    }),
});

export default passwordResetSchema;
