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
};
