
module.exports = {

  /**
     * @api {get} health
     * @apiDescription Get API Status
     * @apiVersion 0.0.1
     * @apiName Health Status
     * @apiGroup Status
     *
     * @apiSuccess {String} Message
  */

  getStatus: async (req, res) => {
    res.send('Healthy');
  },
};
