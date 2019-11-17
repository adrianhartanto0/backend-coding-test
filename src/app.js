const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const jsonParser = bodyParser.json();

module.exports = (db) => {
  /**
     * @api {get} health
     * @apiDescription Get API Status
     * @apiVersion 0.0.1
     * @apiName Health Status
     * @apiGroup Status
     *
     * @apiSuccess {String} Message
  */

  app.get('/health', (req, res) => res.send('Healthy'));

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

  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    const isInvalidStartLatitude = startLatitude < -90 || startLatitude > 90;
    const isInvalidStartLongtitude = startLongitude < -180 || startLongitude > 180;

    if (isInvalidStartLatitude || isInvalidStartLongtitude) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

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

    return db.run(insertQuery, values, function callback(err) {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      return db.all('SELECT * FROM Rides WHERE rideID = ?', this.lastID, (selectError, rows) => {
        if (selectError) {
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        return res.send(rows);
      });
    });
  });

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

  app.get('/rides', (req, res) => {
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

    return db.all(query, values, (err, rows) => {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.send(rows);
    });
  });

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

  app.get('/rides/:id', (req, res) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, (err, rows) => {
      if (err) {
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.send(rows);
    });
  });

  return app;
};
