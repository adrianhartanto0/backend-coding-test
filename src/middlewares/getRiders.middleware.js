const { outputPage, outputQty } = require('../utils/outputter');


module.exports = {
  validatePage: (req, res, next) => {
    const value = outputPage(req.query.page);

    if (value.error_code) {
      return res.send(value);
    }

    return next();
  },

  validateQty: (req, res, next) => {
    const value = outputQty(req.query.qty);

    if (value.error_code) {
      return res.send(value);
    }

    return next();
  },

  validateEmptyPagination(req, res, next) {
    const { page, qty } = req.query;

    if (!page && !qty) {
      next();
    } else {
      next('route');
    }
  },
};
