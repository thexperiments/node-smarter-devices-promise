var Promise = require('bluebird');
var SmarterClient = require('./smarterClient')
var commands = require('./smarterCommands');
var helper = require('./helper.js');

var ip = "smarterCoffee.fritz.box";
var port = 2081 ;
smarterClient = new SmarterClient(ip, port);

smarterClient.on("connected",function(){
  console.log("connected");
  smarterClient.sendCommand(commands.smarterCoffee.setCups(5));
  setTimeout(function(){smarterClient.sendCommand(commands.smarterCoffee.setCups(10))},10000);
})

smarterClient.on("statusMessage",function(status){
  console.log("Status:" + JSON.stringify(status));
})

console.log("connecting coffee");
smarterClient.connect();
