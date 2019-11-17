const { allAsync } = require('../utils/db');

module.exports = {

  /**
   * @api {get} rides Get All Rides
   * @apiDescription Get All Rides
   * @apiVersion 0.0.1
   * @apiName Get Rides
   * @apiGroup Ride
   *
   * @apiParam {Integer} [page] Page
   * @apiParam {Integer} [qty] Number of rides data per page
   *
   * @apiSuccess {Object[]} rides List of Rides
   * @apiSuccess {Number} rides.rideID Unique Rider ID
   * @apiSuccess {Number} rides.startLat Ride Origin Latitude
   * @apiSuccess {Number} rides.startLong Ride Origin Longtitude
   * @apiSuccess {Number} rides.endLat Ride Destination Latitude
   * @apiSuccess {Number} rides.endLong Ride Destination Longtitude
   * @apiSuccess {String} rides.riderName Rider Name
   * @apiSuccess {String} rides.driverName Driver Name
   * @apiSuccess {String} rides.driverVehicle Driver Vehicle type
   *
   * @apiError (Error) {String} error_code Error Code
   * @apiError (Error) {String} message Error Message
   *
   * @apiSuccessExample Success-Response:
   *
   * HTTP/1.1 200
   *
   * [
   *   {
   *      rideId: 1,
   *      startLat: 89,
   *      startLong: 150,
   *      endLat: 89,
   *      endLong: 150,
   *      riderName: 'rider',
   *      driverName: 'driver',
   *      driverVehicle: 'car',
   *   }
   * ]
   *
   * @apiErrorExample {json} Server Error
   *
   *  {
   *    error_code: 'SERVER_ERROR'
   *    message: 'Unknown error'
   *  }
   *
   * @apiErrorExample {json} Empty Data
   *
   *  {
   *    error_code: 'RIDES_NOT_FOUND_ERROR',
   *    message: 'Could not find any rides'
   *  }
   *
   *  @apiErrorExample Invalid page
   *
   *  {
   *    error_code: 'VALIDATION_ERROR',
   *    message: 'Value of page must be a positive integer'
   *  }
   *  @apiErrorExample Invalid qty
   *
   *  {
   *    error_code: 'VALIDATION_ERROR',
   *    message: 'Value of qty must be a positive integer'
   *  }
   *
   */

  getRides: async (req, res) => {
    const { page, qty } = req.query;

    let query = '';
    const values = [];

    if (page && qty) {
      query = 'SELECT * FROM Rides LIMIT (?) OFFSET (?)';
      const currPage = parseInt(page, 10);
      const pageQty = parseInt(qty, 10);
      const errors = [];

      if (Number.isNaN(currPage) || currPage <= 0) {
        errors.push({
          error_code: 'VALIDATION_ERROR',
          message: 'Value of page must be a positive integer',
        });
      }

      if (Number.isNaN(pageQty) || pageQty <= 0) {
        errors.push({
          error_code: 'VALIDATION_ERROR',
          message: 'Value of qty must be a positive integer',
        });
      }

      if (errors.length > 0) {
        return res.send(errors);
      }

      values.push(pageQty);
      values.push(((page - 1) * pageQty));
    } else {
      query = 'SELECT * FROM Rides';
    }

    try {
      const rows = await allAsync(query, values);

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.send(rows);
    } catch (e) {
      return res.send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      });
    }
  },
};
