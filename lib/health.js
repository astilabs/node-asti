var AstiError = require('./error').AstiError;
var _ = require('underscore');
var memwatch = require('memwatch');
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
//  * //interval - interval in ms to get data and send to statsd (defaults to 100ms)
//  * stats    - node-asti metrics object (required)
//  * //logger   - node-asti logger object for logging (optional)
//
api.startMonitoring = function startMonitoring(options) {
  options = options || {};
  /*if (!api._stats) {
    throw new AstiError('You must specify a node-asti metrics object in options.stats');
  }*/
  api._stats = options.stats;
  /*api._logger = options.logger;
  if (api._logger) {
    api._logger = api._logger.child({widget_type: 'health'});
  }*/
  //api._interval = options.interval || 2000; // interval to get data, defaults to ms

  api._lag = options.lag;
  api._mem = options.mem;
  _monitorEventLoop();
  _monitorLeaks();
};

var _monitorLeaks = function _monitorLeaks() {
  if (api._mem) {
    memwatch.on('leak', function leak(stat) {
	    //api._log({leak: stat}, 'Memory Leak Event');
      if (api._stats) {
        api._stats.increment('leak');
      }
    });

    memwatch.on('stats', function stat(stats) {
      if (api._stats) {
        _.each(stats, function(value, key) {
          api._stats.gauge('memstat.'+key, value);
        });
      }
      //api._log({mem: stats}, 'Memory Stats Event');
    });
  };
};

api.stopMonitoring = function stopMonitoring() {
  if (api._loopTimer) {
    clearInterval(api._loopTimer);
  }
};

/*api._log = function _log(obj, msg) {
  if(api._logger) {
    api._logger.info(obj, msg);
  }
};*/

api._stat = function _stat(value, key) {
  if(api._stats) {
    api._stats.gauge(key, value);
  }
};


var _monitorEventLoop = function _monitorEventLoop() {

  var toobusy = api.toobusy;
  var trackMetrics = function trackMetrics() {
    if (api._exiting) {
      return;
    }
    var metrics = {
    };
    if (api._lag) {
      metrics.lag = toobusy.lag();
    }
    if (api._mem) {
      var memory = process.memoryUsage();
      metrics.rss = memory.rss;
      metrics.heapTotal = memory.heapTotal;
      metrics.heapUsed = memory.heapUsed;
    }
    api.outputEvents(metrics);
  }
  api._loopTimer = setInterval(trackMetrics, api._interval);
};

api.outputEvents = function outputEvents(metrics) {
  _.each(metrics, function(value, key) {
    //api._log({value: value, metric: key}, 'Health Metric');
    api._stat(value, key);
  });
};