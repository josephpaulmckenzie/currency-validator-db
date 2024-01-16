// serialPatterns.js

module.exports = {
    // Valid Serial Number Pattern - Check if a serial number matches the serial number pattern(s)
    validSerialNumberPattern: /^[A-Q]?[A-L][[:blank:]]?(\d{8})[[:blank:]]?[A-Q]$/g,

    // Example: Check if a serial number matches the low serial number pattern
    lowSerialNumberPattern: /^0{4}\d{4}$|^0{5}\d{3}$|^0{6}\d{2}$|^0{7}\d{1}$/,
  
    // Example: Check if a serial number matches the high serial number pattern
    highSerialNumberPattern: /^9{4}\d{4}$|^9{5}\d{3}$|^9{6}\d{2}$|^9{7}\d{1}$|^(96000000|99200000|99840000|99999999)$/,
  
    // Example: Check if a serial number matches the ladder pattern
    ladderSerialPattern: /^(?:(\d)\1*([^\1]\1*))*$|^(0123456789|9876543210)$/,
  
  
    // Example: Check if a serial number is cpmpletely solid 
    isASolidNumberSerialPattern: /^(\d)\1{7}$/,
  
    // Radar Serial Number -A radar is where the second four digits are the reverse of the first four digits.
   isRadarSerialPattern: /^(\d)(\d)(\d)(\d)\4\3\2\1$|^(\d)(\d)(\d)(\d)\1\2\3\4$/,
    // Examples: '11188111,20066002,12344321'

  // Radar Repeater - A radar repeater is both a radar and a repeater.
  isRadarRepeaterSerial: /^(?=\d*$)\d*(\d{4})\d*\1\d*$/,
  // Examples: '01100110,02200220,98899889'

  // Super Radar - In a super radar, the interior digits are all the same.
  isSuperRadarSerial: /^(\d)\1*([^\1]\1*)*$/,
  // Examples: '71111117,98888889'

  // Super Repeater - In a super repeater, the first two digits are repeated four times.
  isSuperRepeaterSerial: /^(\d{2})\1{3}$/,
  // Example: '01010101, 02020202, 03030303'

  // Double Quad - In a double quad serial number, the first four digits and the second four digits are the same.
  isDoubleQuadSerial: /^(\d{4})\1$/,
  // Example: '12341234,08800880'

  // Seven-Of-A-Kind - In a seven-of-a-kind serial number, seven digits are all the same.
  isSevenOfAKindSerialPattern: /^(\d)\1{6}$/,
  // Example: '11111111'

  // Seven-In-A-Row - In a seven-in-a-row serial number, seven consecutive digits are all the same.
  isSevenInARowSerial: /^(\d)\1{6}$/,
  // Example: '12345678'

  // Binary - In a binary serial number, only two numbers appear.
  isBinarySerial: /^(?!(\d)\1*$)([0-9])\d*([0-9])\d*$/,
  // Examples: '10101010,12122112,34343434'

  // True Binary - In a true binary serial number, those two numbers are zero and one.
  isTrueBinarySerial: /^(01|10)+$/,
    // Example: '01010101'
  
    // Example: Check if a serial number contains the number 420
    containsNumber420Pattern: /^(\d*420\d*|\d*420|\d*420\d*)$/,

};
