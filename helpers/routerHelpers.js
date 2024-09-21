const Joi = require("joi");

const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value["params"] = {};

      req.value.body = validatorResult.value;
      next();
    }
  };
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const validatorResult = schema.validate({ param: req.params[name] });

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.params[name] = req.params[name];
      next();
    }
  };
};

const schemas = {
  authSignInSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  authSignUpSchema: Joi.object().keys({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  productSchema: Joi.object().keys({
    title: Joi.string().min(1).required(),
    price: Joi.string().min(5).required(),
    singer: Joi.string().allow("").optional(),
    img: Joi.string().allow("").optional(),
    song: Joi.string().allow("").optional(),
    prePrice: Joi.string().allow("").optional(),
    type: Joi.string().allow("").optional(),
    duration: Joi.string().allow("").optional(),
    description: Joi.string().allow("").optional(),
  }),

  idSchema: Joi.object().keys({
    param: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),

  userSchema: Joi.object().keys({
    name: Joi.string().min(1).required(),
    phonenumber: Joi.string().allow("").optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    avatar: Joi.string().allow("").optional(),
    address: {
      province: Joi.string().allow("").optional(),
      district: Joi.string().allow("").optional(),
      ward: Joi.string().allow("").optional(),
      detail: Joi.string().allow("").optional(),
    },
  }),

  userOptionalSchema: Joi.object().keys({
    name: Joi.string().min(1).optional(),
    phonenumber: Joi.string().allow("").optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    avatar: Joi.string().allow("").optional(),
    address: {
      province: Joi.string().allow("").optional(),
      district: Joi.string().allow("").optional(),
      ward: Joi.string().allow("").optional(),
      detail: Joi.string().allow("").optional(),
    },
  }),
};

module.exports = { validateBody, validateParam, schemas };
