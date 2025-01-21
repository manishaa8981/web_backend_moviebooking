const joi = require("joi");

const customerSchema = joi.object({
  full_name: joi.string().required(),
  email: joi.string().required().email(),
  contact_no: joi.string().required(),
  image: joi.string(),
});

function CustomerValidation(req, res, next) {
  const { full_name, email, contact_no, image } = req.body;
  const { error } = customerSchema.validate({
    full_name,
    email,
    contact_no,
    image,
  });
  if (error) {
    return res.json(error);
  }
  next();
}

module.exports = CustomerValidation;
