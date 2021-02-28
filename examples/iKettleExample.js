var Promise = require('bluebird');
var iKettle = require('../src/iKettle')

var myKettle = new iKettle("iKettle.fritz.box");
myKettle.connect().then(function(){
  myKettle.getWaterlevelOffset();
  myKettle.startHeatingCustom(60,5).delay(5000).then(function(){
    myKettle.stopHeating();
  });
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