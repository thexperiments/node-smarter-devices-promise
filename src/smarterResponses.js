var helper = require('./helper.js');
var params = require('./smarterParams.js');
var iKettleResponses = function(){};
var smarterCoffeeResponses = function(){};
var smarterGeneralResponses = function(){};

module.exports = {
  iKettle: new iKettleResponses(),
  smarterCoffee: new smarterCoffeeResponses(),
  general: new smarterGeneralResponses(),
};

//
// Responses for iKettle 2.0
//

// status message from kettle
iKettleResponses.prototype.status = 0x14;

iKettleResponses.prototype.status_decode = function(payload) {
  // decode status message
  var kettleStatus = {};

  //read status
  kettleStatus.ready = payload[0] == params.iKettle.status.ready;
  kettleStatus.heating = payload[0] == params.iKettle.status.heating;
  kettleStatus.keep_warm = payload[0] == params.iKettle.status.keep_warm;
  kettleStatus.cycle_finished = payload[0] == params.iKettle.status.cycle_finished;
  kettleStatus.formula_cooling = payload[0] == params.iKettle.status.formular_cooling;

  //read temperature
  kettleStatus.temperature = payload[1] != params.iKettle.status.off_base ? payload[1] : 0;
  kettleStatus.onBase = payload[1] == params.iKettle.status.off_base ? false : true;

  //read waterlevel (combine high and lowbyte)
  kettleStatus.waterlevel = (payload[2] << 8) | payload[3];

  return kettleStatus;
};

// status message from kettle
iKettleResponses.prototype.waterlevelOffset = 0x2d;

iKettleResponses.prototype.waterlevelOffset_decode = function(payload) {
  //return the offsett (combine high and lowbyte)
  return (payload[0] << 8) | payload[1];
};

//
// Responses for smarter coffee
//

// status message from smarter coffee
smarterCoffeeResponses.prototype.status = 0x32

smarterCoffeeResponses.prototype.status_decode = function(payload) {
  // decode status message
  var coffeeStatus = {};

  //read status
  coffeeStatus.carafeDetected = helper.getBit(payload[0], 0) == params.smarterCoffee.status.carafe_present;
  coffeeStatus.grinderEnabled = helper.getBit(payload[0], 1) == params.smarterCoffee.grinder.beans;
  coffeeStatus.ready = helper.getBit(payload[0], 2) == params.smarterCoffee.status.ready;
  coffeeStatus.grinderActive = helper.getBit(payload[0], 3) == params.smarterCoffee.status.grinder_active;
  coffeeStatus.heaterActive = helper.getBit(payload[0], 4) == params.smarterCoffee.status.heater_active;
  coffeeStatus.working = helper.getBit(payload[0], 5); //currently no propper mapping known
  coffeeStatus.hotplateActive = helper.getBit(payload[0], 6) == params.smarterCoffee.status.hotplate_present;
  coffeeStatus.timerTriggered = helper.getBit(payload[0], 7) == params.smarterCoffee.status.timer_triggered;

  //read waterlevel
  var demergedWaterlevel = helper.unmergeBytes(payload[1], 4)
  coffeeStatus.waterlevel = "undefined";
  console.log(demergedWaterlevel);
  switch (demergedWaterlevel[1]){
    case params.smarterCoffee.waterlevel.empty:
      coffeeStatus.waterlevel = "empty";
      break;
    case params.smarterCoffee.waterlevel.low:
      coffeeStatus.waterlevel = "low";
      break;
    case params.smarterCoffee.waterlevel.half:
      coffeeStatus.waterlevel = "half";
      break;
    case params.smarterCoffee.waterlevel.full:
      coffeeStatus.waterlevel = "full";
      break;
  }
  coffeeStatus.enaughWater = demergedWaterlevel[0] == params.smarterCoffee.waterlevel.enaugh;

  //read strength
  coffeeStatus.strength = "undefined";
  switch (payload[3]){
    case params.smarterCoffee.strength.weak:
      coffeeStatus.strength = "weak";
      break;
    case params.smarterCoffee.strength.medium:
      coffeeStatus.strength = "medium";
      break;
    case params.smarterCoffee.strength.strong:
      coffeeStatus.strength = "strong";
      break;
  }

  //read cups
  var demergedCups = helper.unmergeBytes(payload[4], 4)
  coffeeStatus.cupsSet = demergedCups[1];
  coffeeStatus.cupsBrewed = demergedCups[0];

  return coffeeStatus;
};

//
// General responses
//

// response to a command sent
smarterGeneralResponses.prototype.commandResponse = 0x03

smarterGeneralResponses.prototype.commandResponse_decode = function(payload) {
  // possible payloads for command response message
  var commandResponse = 
  {
    success: false,
    info : "undefined"
  };

  switch (payload[0]){
    case params.general.commandResponse.success:
      commandResponse.success = true;
      commandResponse.info = "success";
      break;
    case params.general.commandResponse.busy:
      commandResponse.info = "busy";
      break;
    case params.general.commandResponse.no_carafe:
      commandResponse.info = "no_carafe";
      break;
    case params.general.commandResponse.no_water:
      commandResponse.info = "no_water";
      break;
    case params.general.commandResponse.no_carafe2:
      commandResponse.info = "no_carafe2";
      break;
    case params.general.commandResponse.no_water2:
      commandResponse.info = "no_water2";
      break;
    case params.general.commandResponse.failed:
      commandResponse.info = "failed";
      break;
    case params.general.commandResponse.busy:
      commandResponse.info = "busy";
      break;
  }
  return commandResponse;
};