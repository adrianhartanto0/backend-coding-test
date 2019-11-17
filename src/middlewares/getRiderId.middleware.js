const { outputRiderId } = require('../utils/outputter');


module.exports = {
  validateRiderId: (req, res, next) => {
    const value = outputRiderId(req.params.id);

    if (value.error_code) {
      return res.send(value);
    }

    return next();
  },
};
