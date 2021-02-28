var helper = require('./helper.js');
var iKettleCommands = function(){};
var smarterCoffeeCommands = function(){};

module.exports = {
  iKettle: new iKettleCommands(),
  smarterCoffee: new smarterCoffeeCommands(),
};

//
// Commands for iKettle 2.0
//

iKettleCommands.prototype.stopHeating = function() {
  // stop heating
  return [0x16];
};

iKettleCommands.prototype.startHeating = function() {
  // heat to default settings
  return [0x21];
};

iKettleCommands.prototype.startHeatingCustom = function(temperature, keepwarmTime) {
  // heat to desired temparature and optionally activate keep warm function
  return [0x15, temperature, keepwarmTime];
};

iKettleCommands.prototype.heatFormula = function(temperature, keepwarmTime) {
  // heat using formula mode 
  // water will be brought to default temperature
  // you will be notified after cooldown to desired temperature
  // it can then be kept at the desired temperature for a certain time
  return [0x15, temperature, keepwarmTime];
};

iKettleCommands.prototype.getWaterlevelOffset = function() {
  // get the offset for the watersensor
  return [0x2b];
};

iKettleCommands.prototype.getInfo = function() {
  // get the offset for the watersensor
  return [0x16];
};

//
// Commands for smarter coffee
//

smarterCoffeeCommands.prototype.startBrewing = function() {
  // start brewing coffee
  return [0x37];
};

smarterCoffeeCommands.prototype.stopBrewing = function() {
  // stop brewing coffee
  return [0x34];
};

smarterCoffeeCommands.prototype.startBrewingCustom = function(cups, strength, hotplateTime, grind) {
  // start brewing coffee with custom parameters
  return [0x33, cups, strength, hotplateTime, grind];
};

smarterCoffeeCommands.prototype.setStrength = function(strength) {
  // set the strength
  return [0x35, cups];
};

smarterCoffeeCommands.prototype.setCups = function(cups) {
  // set the number of cups
  return [0x36, cups];
};

smarterCoffeeCommands.prototype.turnHotplateOn = function(hotplateTime) {
  // turn on the hotplate for hotplateTime minutes
  return [0x3e, hotplateTime];
};

smarterCoffeeCommands.prototype.turnHotplateOff = function() {
  // turn hotplate off
  return [0x4a];
};
