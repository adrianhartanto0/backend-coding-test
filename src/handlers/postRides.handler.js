const { allAsync, runAsync } = require('../utils/db');


module.exports = {

  /**
   * @api {post} rides Create new Ride
   * @apiDescription Create new Ride
   * @apiVersion 0.0.1
   * @apiName Post Ride
   * @apiGroup Ride
   *
   * @apiParam (Body) {Number} start_lat Ride Origin Latitude.
   * @apiParam (Body) {Number} start_long Ride Origin Longtitude.
   * @apiParam (Body) {Number} end_lat Ride Destination Latitude.
   * @apiParam (Body) {Number} end_long  Ride Destination Longtitude.
   * @apiParam (Body) {String} rider_name Rider Name.
   * @apiParam (Body) {String} driver_name Driver Name.
   * @apiParam (Body) {String} driver_vehicle Driver Vehicle.
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
   * @apiErrorExample {json} Invalid Origin Longtitude/Latitude
   *
   *  {
   *    error_code: 'VALIDATION_ERROR'
   *    message: '
   *      Start latitude & longitude must be between -90 - 90 & -180 to 180 degrees respectively
   *    '
   *  }
   *
   *  @apiErrorExample {json} Invalid Destination Longtitude/Latitude
   *
   *  {
   *    error_code: 'VALIDATION_ERROR'
   *    message: '
   *      End latitude & longitude must be between -90 - 90 & -180 to 180 degrees respectively
   *    '
   *  }
   *
   *  @apiErrorExample {json} Invalid Rider Name
   *
   *  {
   *    error_code: 'VALIDATION_ERROR'
   *    message: 'Rider name must be a non empty string
   *  }
   *
   *  @apiErrorExample {json} Invalid Driver Name
   *
   *  {
   *    error_code: 'VALIDATION_ERROR'
   *    message: 'Driver name must be a non empty string
   *  }
   *
  *  @apiErrorExample {json} Invalid Driver's Vehicle
    *
    *  {
    *    error_code: 'VALIDATION_ERROR'
    *    message: 'Vehicle type must be a non empty string
    *  }
    *
    * @apiErrorExample {json} Server Error
    *
    *  {
    *    error_code: 'SERVER_ERROR',
    *    message: 'Unknown error'
    *  }
    *
    */

  postRides: async (req, res) => {
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Driver name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Vehicle type must be a non empty string',
      });
    }

    const values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle,
    ];

    const insertQuery = 'INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const getLastIdQuery = 'SELECT last_insert_rowid() AS id';
    const getLastInsertedQuery = 'SELECT * FROM Rides WHERE rideID = ?';

    try {
      await runAsync(insertQuery, values);
      const data = await allAsync(getLastIdQuery);
      const rows = await allAsync(getLastInsertedQuery, data.pop().id);
      return res.send(rows);
    } catch (e) {
      return res.send({
        error_code: 'SERVER_ERROR',
        message: 'Unknown error',
      });
    }
  },
};
