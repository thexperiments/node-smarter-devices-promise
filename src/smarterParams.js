var helper = require('./helper.js');
var iKettleParams = function(){};
var smarterCoffeeParams = function(){};
var smarterGeneralParams = function(){};

module.exports = {
  iKettle: new iKettleParams(),
  smarterCoffee: new smarterCoffeeParams(),
  general: new smarterGeneralParams(),
};

//
// Params for iKettle 2.0
//

iKettleParams.prototype.status = {
  // status params
  ready: 0x00,
  heating: 0x01,
  keep_warm: 0x02,
  cycle_finished: 0x03,
  formula_cooling: 0x04,
  off_base: 0x7f,
};

//
// Params for smarter coffee
//

smarterCoffeeParams.prototype.status = {
  // status params
  carafe_present: 0x01,
  carafe_absent: 0x00,
  grinder_active: 0x01,
  grinder_inactive: 0x00,
  ready: 0x01,
  busy: 0x00,
  heater_active: 0x01,
  heater_inactive: 0x00,
  hotplate_active: 0x01,
  hotplate_inactive: 0x00,
  timer_triggered: 0x01,
  timer_not_triggered: 0x00,
};

smarterCoffeeParams.prototype.waterlevel = {
  // waterlevel params
  empty: 0x00,
  low: 0x01,
  half: 0x02,
  full: 0x03,
  enaugh: 0x01,
};

smarterCoffeeParams.prototype.strength = {
  // strength params
  weak: 0x00,
  medim: 0x01,
  strong: 0x02,
};

smarterCoffeeParams.prototype.grinder = {
  // grind params
  filter: 0x00,
  beans: 0x01,
};

smarterCoffeeParams.prototype.hotplate = {
  // hotplate params
  on: 0x00,
  off: 0x01,
};

//
// general params
//

smarterGeneralParams.prototype.commandResponse = {
  // command response params
  success: 0x00,
  busy: 0x01,
  no_carafe: 0x02,
  no_water: 0x03,
  failed: 0x04,
  no_carafe2: 0x05,
  no_water2: 0x06,
  cant_finish: 0x07,
  time_error: 0x0d,
  invalid_command: 0x69,
};