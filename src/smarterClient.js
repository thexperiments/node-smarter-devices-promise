var Promise = require('bluebird');
var helper = require('./helper');
var responses = require('./smarterResponses');
var commands = require('./smarterCommands');
var e = require('events');
var util = require('util');

var net = require('net');

const MESSAGE_TAIL = 0x7e;
const CON_RETRIES = 10;
const CON_TIMEOUT = 5000; //ms

var SmarterClient = function(ip, port){
  helper.debug("Constructor called for " + ip + ":" + port);
  //make this an event emitter
  e.EventEmitter.call(this);

  this.ip = ip;
  this.port = port;

  this.socket = null;
  this.isConnected = false;
  this.lastCommandPromise = Promise.resolve();

  this.connectionRetries = 0;

  _this = this;

  //clean disconnection
  process.on('exit', function(){_this.disconnect();})
}

util.inherits(SmarterClient, e.EventEmitter);

SmarterClient.prototype.sendCommand = function(commandBytes){
  var message = commandBytes;
  // concatenate message tail
  message.push(MESSAGE_TAIL);
  this.lastCommandPromise = this._sendMessage(message)
  return this.lastCommandPromise;
}

SmarterClient.prototype.connect = function(){
  if (this.isConnected) return Promise.resolve();
  var _this = this;
  helper.debug("Connecting to " + this.ip + ":" + this.port);
  this.socket = new net.Socket();
  this.socket.on("close",  function() {_this._handleClose()});
  this.socket.on("data",  function(data) {_this._handleData(data)});
  this.socket.on("error",  function(data) {_this._handleError(data)});
  return new Promise(function(_resolve,_reject){
    _this.socket.connect(_this.port, _this.ip, function(){
      _this.isConnected = true
      _this.emit('connected');
      helper.debug("Connected to " + _this.ip + ":" + _this.port);
      _resolve();
    })
    //make the promise time out
    //setTimeout(function(){_reject('connection could not be established')},CON_TIMEOUT);
  });
}

SmarterClient.prototype.disconnect = function(){
  var _this = this;
  _this.socket.end();
}

SmarterClient.prototype._handleData = function(data){
  helper.debug("Received: " + helper.buffer2hex(data));
  var messageType = data[0];
  var messagePayload = data.slice(1,data.length - 1);
  var messageTail = data[data.length - 1];
  //todo: check message tail
  this.emit('messageReceived', messageType, messagePayload);
  if (messageType == 0x14){
    this.emit('statusMessage', messagePayload);
  }
}

SmarterClient.prototype._handleError = function(data){
  helper.debug("Received Error: " + data.message);
}

SmarterClient.prototype._handleClose = function(){
  helper.debug("Connection to " + this.ip + ":" + this.port + " closed");
  this.emit('disconnected');
  this.isConnected = false;
  _this = this;
  if (this.connectionRetries <= CON_RETRIES){
    setTimeout(function(){
      _this.connectionRetries += 1;
      _this.connect();
    }, 10000);
  }
}

SmarterClient.prototype._sendMessage = function(message){
  var _this = this;
  var messageBuffer = Buffer.from(message);
  helper.debug("Sending: " + helper.buffer2hex(messageBuffer));
  //make sure we are connected before trying to send
  //this will also reconnect if connection was lost
  return this.connect().then(function(){
    //send the message
    return new Promise (function (_resolve, _reject){
      _this.socket.write(messageBuffer.toString("ascii"), function(){
        _resolve();
      });
    });
  });
}

module.exports = SmarterClient;