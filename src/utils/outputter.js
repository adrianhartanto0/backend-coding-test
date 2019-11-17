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
};
