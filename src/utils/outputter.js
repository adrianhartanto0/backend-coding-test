module.exports = {
  outputRows: (rows) => {
    if (rows && rows.length === 0) {
      return {
        error_code: 'RIDES_NOT_FOUND_ERROR',
        message: 'Could not find any rides',
      };
    }

    return {};
  },
  outputServerError: () => ({
    error_code: 'SERVER_ERROR',
    message: 'Unknown error',
  }),

  outputRiderId: (id) => {
    const riderId = parseInt(id, 10);
    if (Number.isNaN(riderId) || (!Number.isNaN(riderId) && id < 0)) {
      return {
        error_code: 'VALIDATION_ERROR',
        message: 'Rider Id must be positive integer',
      };
    }

    return {};
  },

  outputPage: (page) => {
    const currPage = parseInt(page, 10);
    if (Number.isNaN(currPage) || (!Number.isNaN(currPage) && currPage < 0)) {
      return {
        error_code: 'VALIDATION_ERROR',
        message: 'Value of page must be a positive integer',
      };
    }

    return {};
  },

  outputQty: (qty) => {
    const currQty = parseInt(qty, 10);
    if (Number.isNaN(currQty) || (!Number.isNaN(currQty) && currQty < 0)) {
      return {
        error_code: 'VALIDATION_ERROR',
        message: 'Value of qty must be a positive integer',
      };
    }

    return {};
  },

  outputStartLatLong: (lat, long) => {
    const startLatitude = Number(lat);
    const startLongitude = Number(long);
    const error = {
      error_code: 'VALIDATION_ERROR',
      message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
    };

    let payload = {};

    if (Number.isNaN(startLatitude) || Number.isNaN(startLongitude)) {
      payload = error;
    }

    if (Number.isNaN(startLatitude) && Number.isNaN(startLongitude)) {
      const isInvalidStartLatitude = startLatitude < -90 || startLatitude > 90;
      const isInvalidStartLongtitude = startLongitude < -180 || startLongitude > 180;

      if (isInvalidStartLatitude || isInvalidStartLongtitude) {
        payload = error;
      }
    }

    return payload;
  },
};
