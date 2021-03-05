var Promise = require('bluebird');
var SmarterClient = require('./smarterClient')
var commands = require('./smarterCommands');
var responses = require('./smarterResponses');
var helper = require('./helper.js');
var e = require('events');
var util = require('util');

var iKettle = function(host){
  //make this an event emitter
  e.EventEmitter.call(this);
  this.port = 2081;
  this.host = host;
  this.smarterClient = new SmarterClient(this.host, this.port);
  this.status = {};
  this.waterlevelCalibratedOffset = 0; //currently not used doesn't look correct, was 2390 for me
  this.waterlevelOffsetEmpty = 2100; //default from my kettle, handle on the right
  this.waterlevelOffset1L = 2175; //default from my kettle filled with 1L water, handle on the right
  this.aliveTimeoutTimer = {}
  var _this = this;

  //event forwarding
  this.smarterClient.on('connected', function(){
    console.log(_this);
    _this.emit('connected');
  });
  this.smarterClient.on('messageReceived', function(messageType, messagePayload){
      switch (messageType){
      case responses.general.commandResponse:
        _this.emit('commandResponse', responses.general.commandResponse_decode(messagePayload))
        break;
      case responses.iKettle.status:
        _this.status = responses.iKettle.status_decode(messagePayload)
        //correct the waterlevel and convert it to ml
        var litersPerUnit = 1.0 / (_this.waterlevelOffset1L - _this.waterlevelOffsetEmpty)
        var unitDelta = _this.status.waterlevel - _this.waterlevelOffsetEmpty;
        _this.status.waterlevelLiters = Math.round((unitDelta * litersPerUnit) * 10)/10.0;
        _this.emit('statusMessage', _this.status);
        //expect a status message at least every 5 seconds
        //reset timout on every sucesfully arrived status message
        clearTimeout(_this.aliveTimeoutTimer);
        //and set up a new one
        _this.aliveTimeoutTimer = setTimeout(function(){
          //reset the connection of no status was received for 5s
          _this.smarterClient.disconnect();
        }, 5000);
        break;
      case responses.iKettle.waterlevelOffset:
        _this.waterlevelCalibratedOffset = responses.iKettle.waterlevelOffset_decode(messagePayload);
        _this.emit('waterlevelOffset', _this.waterlevelCalibratedOffset);
        break;
      default:
        _this.emit('otherMessage', messageType, messagePayload)
    }
  });

}
util.inherits(iKettle, e.EventEmitter);

iKettle.prototype.connect = function(){
  return this.smarterClient.connect();
}

iKettle.prototype.disconnect = function(){
  return this.smarterClient.disconnect();
}

iKettle.prototype.setWaterlevelOffsetEmpty = function(waterlevelOffset){
  return Promise.resolve(this.waterlevelOffsetEmpty = waterlevelOffset);
};

iKettle.prototype.setWaterlevelOffset1L = function(waterlevelOffset){
  return Promise.resolve(this.waterlevelOffset1L = waterlevelOffset);
};

iKettle.prototype.stopHeating = function() {
  return this.smarterClient.sendCommand(commands.iKettle.stopHeating());
};

iKettle.prototype.startHeating = function() {
  return this.smarterClient.sendCommand(commands.iKettle.startHeating());
};

iKettle.prototype.startHeatingCustom = function(temperature, keepwarmTime) {
  return this.smarterClient.sendCommand(commands.iKettle.startHeatingCustom(temperature, keepwarmTime));
};

iKettle.prototype.heatFormula = function(temperature, keepwarmTime) {
  return this.smarterClient.sendCommand(commands.iKettle.heatFormula(temperature, keepwarmTime));
};

iKettle.prototype.getWaterlevelOffset = function() {
  return this.smarterClient.sendCommand(commands.iKettle.getWaterlevelOffset());
};

iKettle.prototype.getInfo = function() {
  return this.smarterClient.sendCommand(commands.iKettle.getInfo()).then(function(){
      return new Promise (function (resolve, reject){
        _this.on("statusMessage", resolve)
      });
    });;
};


module.exports = iKettle;