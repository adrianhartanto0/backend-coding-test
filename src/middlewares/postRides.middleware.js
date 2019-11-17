const { outputStartLatLong, outputEndLatLong } = require('../utils/outputter');


module.exports = {
  validateStartLatLong: (req, res, next) => {
    const value = outputStartLatLong(req.body.start_lat, req.body.start_lat);

    if (value.error_code) {
      return res.send(value);
    }

    return next();
  },

  validateEndLatLong: (req, res, next) => {
    const value = outputEndLatLong(req.body.end_lat, req.body.end_long);

    if (value.error_code) {
      return res.send(value);
    }

    return next();
  },
};
