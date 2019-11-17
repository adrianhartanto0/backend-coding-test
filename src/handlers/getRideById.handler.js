const utilsDB = require('../utils/db');
const { outputRows, outputServerError } = require('../utils/outputter');

module.exports = {

  /**
   * @api {get} rides/:id Get a Ride data
   * @apiDescription Get a Ride data
   * @apiVersion 0.0.1
   * @apiName Get Ride
   * @apiGroup Ride
   *
   * @apiParam {Number} id Ride ID
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
   */

  getRideById: async (req, res) => {
    try {
      /* eslint-disable no-console */
      // console.log(allAsync);

      const query = `SELECT * FROM Rides WHERE rideID='${req.params.id}'`;
      const rows = await utilsDB.allAsync(query);
      const value = outputRows(rows);
      return res.send(rows.length === 0 ? value : rows);
    } catch (e) {
      return res.send(outputServerError());
    }
  },
};
