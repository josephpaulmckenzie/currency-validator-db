// serialPatterns.js

module.exports = {
    // Example: Check if a serial number matches the low serial number pattern
    lowSerialNumberPattern: /^0{4}\d{4}$|^0{5}\d{3}$|^0{6}\d{2}$|^0{7}\d{1}$/,
  
    // Example: Check if a serial number matches the high serial number pattern
    highSerialNumberPattern: /^9{4}\d{4}$|^9{5}\d{3}$|^9{6}\d{2}$|^9{7}\d{1}$|^(96000000|99200000|99840000|99999999)$/,
  
    // Example: Check if a serial number matches the ladder pattern
    ladderSerialPattern: /^(?:(\d)\1*([^\1]\1*))*$|^(0123456789|9876543210)$/,
  
    // Example: Check if a serial number matches the binary radar pattern
    isBinaryRadarSerial: /^(?:(\d)\1*([^\1]\1*))*$|^([01]+)$/,
  
    // Example: Check if a serial number matches the 7-in-a-row pattern
    isSevenInARowSerial: /^(\d)\1{6}$/,
  
    // Example: Check if a serial number matches the 7-of-a-kind pattern
    isSevenOfAKindSerial: /^(\d{3})(\d)\2{5}(\d{3})$/,
  
    // Example: Check if a serial number matches the repeater radar pattern
    isRepeaterRadarSerial: /^(\d{4})\1(\d{4})\2$|^(\d+)(?:(?=\d*$)\d*|(\d)\d*\4*)$/,
};
