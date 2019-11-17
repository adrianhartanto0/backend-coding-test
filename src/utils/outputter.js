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
};
