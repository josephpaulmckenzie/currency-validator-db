import * as Interfaces from '../interfaces/interfaces';


const serialNumberPatterns: Interfaces.RegExValidators = {
	
	// Checks to see if a serial number matches a low serial number pattern
	isLowSerialNumberPattern: /^[A-Q]?[A-L]\s?0{4}\d{4}\s?[A-Q]$/,
	// Examples: ' AB00000011C, BL 00001234 D , DA 00000001L'

	// Checks to see if a serial number matches a high serial number pattern
	isHighSerialNumberPattern: /^[A-Q]?[A-L]\s?9{4}\d{4}\s?[A-Q]$/,
	// Examples: 'AB99999911C, BL 99991234 D , DA 99999991L'

	// Checks to see if the serial number matches a ladder pattern
	isLadderSerialPattern: /^(?:\d{8}|01234567|12345678|23456789|87654321|98765432)$/,
	// Examples: 'A12345678D,DL98765432D'

	// Checks to see if a serial number contains all the same digits.
	isASolidNumberSerialPattern: /^(?:[A-Q]?[A-L](?:\s?(\d)\1{7})(?:\s?[A-Q])|(\d)\2{7})$/,
	// Examples:',A11111111D,BA77777777C,CD22222222A'

	// Radar Serial Number - A radar is where the second four digits are the reverse of the first four digits.
	isRadarSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)(\d)(\d)(\d)\4\3\2\1)(?:\s?(\d)(\d)(\d)(\d)\1\2\3\4)(?:\s?[A-Q])$/,
	// // Examples: 'AC11188111G,LA20066002I,LM12344321A'

	// Radar Repeater - A radar repeater is both a radar and a repeater.
	isRadarRepeaterSerialPattern: /^[A-Q]?[A-L](?:\s?(?=\d*$)\d*(\d{4})\d*\1\d*)(?:[[:blank:]][A-Q])$/,
	// Examples: '01100110,02200220,98899889'

	// Super Radar - In a super radar, the interior digits are all the same.
	isSuperRadarSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)\1*([^\1]\1*))(?:[[:blank:]][A-Q])$/,
	// Examples: '71111117,98888889,21111112'

	// // Super Repeater - In a super repeater, the first two digits are repeated four times.
	isSuperRepeaterSerialPattern: /^[A-Q]?[A-L](?:\s?(\d{2})\1{3})(?:[[:blank:]][A-Q])$/,
	// Examples: '01010101, 02020202, 03030303'

	// Double Quad - In a double quad serial number, the first four digits and the second four digits are the same.
	isDoubleQuadSerialPattern: /^[A-Q]?[A-L](?:\s?(\d{4})\1)(?:[[:blank:]][A-Q])$/,
	// Examples: '12341234,08800880,24202420'

	// Seven-Of-A-Kind - In a seven-of-a-kind serial number, seven digits are all the same.
	isSevenOfAKindSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)(?:.*?\1){6})(?:[[:blank:]][A-Q])$/,
	// // Example: '11112111'

	// Seven-In-A-Row - In a seven-in-a-row serial number, seven consecutive digits are all the same.
	isSevenInArowSerialPattern: /^[A-Q]?[A-L](?:\s?(\d)\1{6})(?:[[:blank:]][A-Q])$/,
	// // Example: '11111110'

	// Binary - In a binary serial number, only two numbers appear.
	isBinarySerialPattern: /^[A-Q]?[A-L](?:\s?(?!(\d)\1*$)([0-9])\d*([0-9])\d*)(?:[[:blank:]][A-Q])$/,
	// // Examples: '10101010,12122112,34343434'

	// True Binary - In a true binary serial number, those two numbers are zero and one.
	isTrueBinarySerialPattern: /^[A-Q]?[A-L](?:\s?(01|10)+)(?:[[:blank:]][A-Q])$/,
	// Example: '01010101'

	// Example: Check if a serial number contains the number 420
	fourTwentySerialPattern: /^(?:[A-Q]\s?[A-L]?(?:\s?|\s)(\d*420\d*)(?:\s?[A-Q]))$/,
};

const noteValidators: Interfaces.RegExValidators = {
	// Valid Serial Number Pattern - Check if a serial number matches the serial number pattern(s)
	validSerialNumberPattern: /^[A-Q]?[A-L]\s?\d{8}\s?[A-K]$/,
	// Examples: 'AB12345678C,AB 12345678 C, PA42003287 D, LD 56709823E'

	// Makes Sure that the federal reserve ID is in the correct format(s).
	federalReserveId: /^A1$|^B2$|^C3$|^D4$|^E5$|^F6$|^G7$|^H8$|^I9$|^J10$|^K11$|^L12$/,

	// Checks that note position has a Letter ranging from A-J followed by any number from ranging 1-5
	notePositionId: /^([A-J])\S?[1-5]$/,
	// Examples- 'F3,B2,H 2'

	frontPlateId: /^(FW)\s?([A-J])\s?(\d{1,4})$/,
	// Examples - 'FW A 1, B2, E 5, FW L 122, FW B999'

	validDenomination: /^(?:1|2|5|10|20|50|100)$/,
	// Examples - '1,2,5,10,20,50,100's
};

export {serialNumberPatterns,noteValidators};