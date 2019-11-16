const logger = require('./winston');


module.exports = {
  logInfo(message) {
    logger.info(message);
  },
  logError(message) {
    logger.error(message);
  },
};
