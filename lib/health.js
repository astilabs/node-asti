var AstiError = require('./error').AstiError;
var _ = require('underscore');
var memwatch = require('memwatch');
module.exports = api = {};

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
var Monitor = function Monitor(options) {
  options = options || {};
  /*if (!api._stats) {
    throw new AstiError('You must specify a node-asti metrics object in options.stats');
  }*/
  this._stats = options.stats;
  /*api._logger = options.logger;
  if (api._logger) {
    api._logger = api._logger.child({widget_type: 'health'});
  }*/
  //api._interval = options.interval || 2000; // interval to get data, defaults to ms

  this._lag = options.lag;
  this._mem = options.mem;
  this._monitorEventLoop();
  this._monitorLeaks();
};

Monitor.prototype.stopMonitoring = function stopMonitoring() {
  if (this._loopTimer) {
    clearInterval(this._loopTimer);
  }
};

Monitor.prototype._monitorLeaks = function _monitorLeaks() {
  if (this._mem) {
    memwatch.on('leak', function leak(stat) {
      if (this._stats) {
        this._stats.increment('leak');
      }
    }.bind(this));

    memwatch.on('stats', function stat(stats) {
      if (this._stats) {
        _.each(stats, function(value, key) {
          this._stats.gauge('memstat.'+key, value);
        }.bind(this));
      }
    }.bind(this));
  };
};


Monitor.prototype._stat = function _stat(value, key) {
  if(this._stats) {
    this._stats.gauge(key, value);
  }
};


Monitor.prototype._monitorEventLoop = function _monitorEventLoop() {
  var toobusy = api.toobusy;
  var trackMetrics = function trackMetrics() {
    //console.log(this);
    if (api._exiting) {
      return;
    }
    var metrics = {
    };
    if (this._lag) {
      metrics.lag = toobusy.lag();
    }
    if (this._mem) {
      var memory = process.memoryUsage();
      metrics.rss = memory.rss;
      metrics.heapTotal = memory.heapTotal;
      metrics.heapUsed = memory.heapUsed;
    }
    this.outputEvents(metrics);
  }
  this._loopTimer = setInterval(trackMetrics.bind(this), this._interval);
};

Monitor.prototype.outputEvents = function outputEvents(metrics) {
  _.each(metrics, function(value, key) {
    //api._log({value: value, metric: key}, 'Health Metric');
    this._stat(value, key);
  }.bind(this));
};

// api.toobusy
// ----------------
//
// This function returns node-toobusy
// From https://github.com/lloyd/node-toobusy
api.toobusy = require('toobusy');
api.Monitor = Monitor;