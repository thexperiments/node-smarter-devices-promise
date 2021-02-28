module.exports = {
  int2hex: function int2hex(integer) {
    return result;
  },
  debug: function consoleDebug() {
    //if (debug == undefined || debug == false) return;
    if (typeof arguments[0] == 'string') {
      arguments[0] = 'Smarter devices(debug): ' + arguments[0];
    }
    console.log.apply(this, arguments);
  },
  log:function consoleLog() {
    if (typeof arguments[0] == 'string') {
      arguments[0] = 'Smarter devices: ' + arguments[0];
    }
    console.log.apply(this, arguments);
  },
  mergeBytes: function mergeBytes(leftByte, leftByteOffset, rightByte){
    var mergedByte = 0x00;
    // helper to merge two bytes into one, used for combined values with lower precision each
    mergedByte = (leftByte << leftByteOffset) + rightByte;
    return mergedByte;
  },
  unmergeBytes: function unmergeBytes(mergedByte, leftByteOffset){
    // helper to unmerge two bytes, used for combined values with lower precision each
    var leftByte = 0x00;
    var rightByte = 0x00;

    leftByte = mergedByte >> leftByteOffset;
    rightByte = mergedByte & (0xff >> (leftByteOffset));
    return [leftByte, rightByte];
  },
  generateHeatByte: function generateHeatByte(heatTime){
    var heatActive = 0x00;
    if (heatTime >0){
      //some time is set so we must also activate the keep warm function
      heatActive = 0x01;
    }
    return this.mergeBytes(heatTime, 4, heatActive)
  },
  getBit: function getBit(byte, bitNumber){
    var returnByte = 0x00;
    // helper to merge two bytes into one, used for combined values with lower precision each
    returnByte = (byte >> (bitNumber)) & 0x01;
    return returnByte;
  },
  buffer2hex: function buffer2hex(buffer) {
    var result = [];
    for (var i = 0; i < buffer.length; i++) {
      result.push('0x' + ('0' + (buffer[i]).toString(16)).slice(-2).toUpperCase())
    }
    return result;
  },
}

