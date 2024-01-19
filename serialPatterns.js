// serialPatterns.js
const {sevenOfAKind} = require("./validationFunctions");
let number;
const serialNumberPatterns = {
  
  // Example: Check if a serial number matches the low serial number pattern
  lowSerialNumberPattern:
    /^[A-Q]?[A-L]?[[:blank:]]?0{4}\d{4,7}[[:blank:]]?[A-Q]?$/,

  // Example: Check if a serial number matches the high serial number pattern
  highSerialNumberPattern:
    /^[A-Q]?[A-L]?[[:blank:]]?9{4}\d{3,7}[[:blank:]]?[A-Q]?$/,

  // Example: Check if a serial number matches the ladder pattern
  ladderSerialPattern: /^(?:(\d)\1*([^\1]\1*))*$|^(012345678|987654321)$/,

  // Checks to see if a serial number contains all the same digits.
  isASolidNumberSerialPattern: /^(\d)\1{7}$/,
  // Example:',11111111,77777777,22222222'

  // Radar Serial Number -A radar is where the second four digits are the reverse of the first four digits.
  isRadarSerialPattern: /^(\d)(\d)(\d)(\d)\4\3\2\1$|^(\d)(\d)(\d)(\d)\1\2\3\4$/,
  // Examples: '11188111,20066002,12344321'

  // Radar Repeater - A radar repeater is both a radar and a repeater.
  isRadarRepeaterSerialPattern: /^(?=\d*$)\d*(\d{4})\d*\1\d*$/,
  // Examples: '01100110,02200220,98899889'

  // Super Radar - In a super radar, the interior digits are all the same.
  isSuperRadarSerialPattern: /^(\d)\1*([^\1]\1*)*$/,
  // Examples: '71111117,98888889,21111112'

  // Super Repeater - In a super repeater, the first two digits are repeated four times.
  isSuperRepeaterSerialPattern: /^(\d{2})\1{3}$/,
  // Example: '01010101, 02020202, 03030303'

  // Double Quad - In a double quad serial number, the first four digits and the second four digits are the same.
  isDoubleQuadSerialPattern: /^(\d{4})\1$/,
  // Example: '12341234,08800880,24202420'

  // Seven-Of-A-Kind - In a seven-of-a-kind serial number, seven digits are all the same.
  
  // isSevenOfAKindSerialPattern: sevenOfAKind("11212211"),
  // Example: '11112111'

  // Seven-In-A-Row - In a seven-in-a-row serial number, seven consecutive digits are all the same.
  isSevenInArowSerialPattern: /^(\d)\1{6}$/,
  // Example: '12345678'

  // Binary - In a binary serial number, only two numbers appear.
  isBinarySerialPattern: /^(?!(\d)\1*$)([0-9])\d*([0-9])\d*$/,
  // Examples: '10101010,12122112,34343434'

  // True Binary - In a true binary serial number, those two numbers are zero and one.
  isTrueBinarySerialPattern: /^(01|10)+$/,
  // Example: '01010101'

  // Example: Check if a serial number contains the number 420
  containsNumber420Pattern: /^(\d*420\d*|\d*420|\d*420\d*)$/,
};

// serialPatterns.js

const noteValidators = {

  // Valid Serial Number Pattern - Check if a serial number matches the serial number pattern(s)
  validSerialNumberPattern: /^[A-Q]?[A-L][[:blank:]]?[0-9]{8}[[:blank:]]?[A-Q]$/,
  // Examples: 'AB12345678C,AB 12345678 C, PA42003287 D, LD 56709823E'

  // Makes Sure that the federal reserve ID is in the correct format(s).
  federalReserveId: /^([A-L)])[[:blank:]]?(?:[1-9]|1[0-2])$/,

  // Checks that note position has a Letter ranging from A-J followed by any number from ranging 1-5
  notePositionIdentId: /^([A-J)])[[:blank:]]?[1-5]$/,
  // Examples- 'F3,B2,H 2' 

  frontPlateNumber: /^FW?[[:blank:]]?([A-J])[[:blank:]]?(\d{1,4})$/,
  // Examples - 'FW A 1, B2, E 5, FW L 122, FW B999'

  validDenomination: /^1|2|5|10|20|50|100$/,
  // Examples - '1,2,5,10,20,50,100's
};

module.exports = {
  serialNumberPatterns,
  noteValidators,
};
