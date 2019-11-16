const logger = require('./winston');


module.exports = {
  logInfo: function(message) {
    logger.info(message)
  },
  logError: function(message) {
    logger.error(message)
  }
};
