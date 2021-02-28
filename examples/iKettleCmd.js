var Promise = require('bluebird');
var iKettle = require('../src/iKettle')

var myArgs = process.argv.slice(2);

var host = myArgs[0];
var command = myArgs[1];
var temperature = myArgs[2] || 100;
var keepWarmTime = myArgs[3] || 5;

var myKettle = new iKettle(host);
myKettle.connect().then(function(){
  console.log("Command:" + command);
  switch (command) {
    case 'startHeating':
      return myKettle.startHeating();
      break;
    case 'stopHeating':
      return myKettle.stopHeating();
      break;
    case 'startHeatingCustom':
      return myKettle.startHeatingCustom(temperature,keepWarmTime);
      break;
    default:
      return Promise.reject("unknown command");
      break;
  }
})
.delay(100)
.finally(function(){
  myKettle.disconnect();
  process.exit(0);
  return Promise.resolve();
});

myKettle.on("connected",function(){
  console.log("connected");
})

myKettle.on("statusMessage",function(status){
  console.log("Status:" + JSON.stringify(status));
})

myKettle.on("waterlevelOffset",function(waterlevel){
  console.log("waterlevelOffset:" + waterlevel);
})