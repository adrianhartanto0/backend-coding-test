const utilsDB = require('../utils/db');
const { outputRows, outputServerError } = require('../utils/outputter');


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
   *      rideID: '006ad6c8-12d5-4d28-b24b-1fa66e8b746a',
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
      const pageQty = parseInt(qty, 10);
      const pageInt = parseInt(page, 10);
      values.push(pageQty);
      values.push(((pageInt - 1) * pageQty));
    } else {
      query = 'SELECT * FROM Rides';
    }

    try {
      const rows = await utilsDB.allAsync(query, values);
      const value = outputRows(rows);
      return res.send(rows.length === 0 ? value : rows);
    } catch (e) {
      return res.send(outputServerError());
    }
  },
};
