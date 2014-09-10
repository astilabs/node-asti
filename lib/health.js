var AstiError = require('./error')();
var _ = require('underscore');
var memwatch = require('memwatch');

module.exports = function(config) {
  return new Monitor(config);
};

// api.startMonitoring
// ----------------
//
// This function starts monitoring the health of your nodejs
// application
//
// __Parameters__
// * config: `config` - _Object_
//
// ```
// config.statsd = statsd; // node-asti statsd object(required)
// config.logger = logger; // node-asti logger object(optional)
// config.interval = 2000; // defaults to 2000ms(optional)
// ```
//
var Monitor = function Monitor(config) {
  if(!config) {
    throw new AstiError('ConfigNotProvided', 'node-asti.health');
  }
  if(!config.statsd) {
    throw new AstiError('ConfigStatsdNotProvided', 'node-asti.health');
  }

  this._stats = config.statsd;
  if(config.logger) {
    this._logger = config.logger.child({widget_type: 'health'});
  }
  this._interval = config.interval || 2000;
  this._mem = config.mem;
  this._monitorEventLoop();
  this._monitorLeaks();
};

Monitor.prototype.stopMonitoring = function stopMonitoring() {
  if (this._loopTimer) {
    clearInterval(this._loopTimer);
  }
  //toobusy.shutdown();
};

Monitor.prototype._monitorLeaks = function _monitorLeaks() {
  if (this._mem) {
    memwatch.on('leak', function leak() {
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
  }
};

Monitor.prototype._stat = function _stat(value, key) {
  if(this._stats) {
    this._stats.gauge(key, value);
  }
};

Monitor.prototype._monitorEventLoop = function _monitorEventLoop() {
  var trackMetrics = function trackMetrics() {
    var metrics = {};
    if (this._mem) {
      var memory = process.memoryUsage();
      metrics.rss = memory.rss;
      metrics.heapTotal = memory.heapTotal;
      metrics.heapUsed = memory.heapUsed;
    }
    this.outputEvents(metrics);
  };
  this._loopTimer = setInterval(trackMetrics.bind(this), this._interval);
};

Monitor.prototype.outputEvents = function outputEvents(metrics) {
  _.each(metrics, function(value, key) {
    this._stat(value, key);
  }.bind(this));
};

Monitor.prototype._log = function(obj, msg) {
  if(this._logger) {
    this._logger.debug(obj, msg);
  }
};
