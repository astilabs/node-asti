var AstiError = require('./error').AstiError;
module.exports = api = {};

// api.toobusy
// ----------------
//
// This function returns node-toobusy
// From https://github.com/lloyd/node-toobusy
api.toobusy = require('toobusy');

// api.startMonitoring
// ----------------
//
// This function starts monitoring the health of your nodejs
// application
//
// __Parameters__
// * options:
//  * interval - interval in ms to get data and send to statsd (defaults to 100ms)
//  * stats    - node-asti metrics object (required)
//  * logger   - node-asti logger object for logging (optional)
//
api.startMonitoring = function startMonitoring(options) {
  options = options || {};
  /*if (!api._stats) {
    throw new AstiError('You must specify a node-asti metrics object in options.stats');
  }*/
  api._stats = options.stats;
  api._logger = options.logger;
  api._interval = options.interval || 250; // interval to get data, defaults to ms

  _monitorEventLoop();
};

api.stopMonitoring = function stopMonitoring() {
  if (api._loopTimer) {
    clearInterval(api._loopTimer);
  }
};

api._log = function _log(obj, msg) {
  if(api._logger) {
    api._logger.info(obj, msg);
  }
};


var _monitorEventLoop = function _monitorEventLoop() {

  var toobusy = api.toobusy;
  var trackLag = function trackLag() {
    if (api._exiting) {
      return;
    }
    api._log({lag: toobusy.lag()}, 'event loop lag')
  }
  api._loopTimer = setInterval(trackLag, api._interval);
};