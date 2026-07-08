const { validationResult } = require('express-validator');
const response = require('../utils/response');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map(err => ({
      field: err.param || err.path,
      message: err.msg
    }));

    return response.error(res, 400, 'Validasi gagal', formattedErrors);
  };
};

module.exports = { validate };
