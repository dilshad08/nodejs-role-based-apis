const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(5).required(),
  password2: Joi.ref("password"),
  type: Joi.number().required(),
  class: Joi.array(),
  role: Joi.objectId().required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

// const classSchema = Joi.object({
//   name: Joi.string().required(),
//   user: Joi.objectId(),
//   token: Joi.string(),
// });

module.exports = {
  registerSchema,
  loginSchema,
  // classSchema,
};
