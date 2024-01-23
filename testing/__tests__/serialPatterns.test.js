const { serialNumberPatterns } = require("../../serialPatterns");

let coolSerialPatterns;

beforeEach(() => {
  coolSerialPatterns = {
    serialNumber: "",
    patternMatches: {
      lowSerialNumber: false,
      highSerialNumber: false,
      ladderSerialNumber: false,
      isBinaryRadarSerial: false,
      isSevenInARowSerial: false,
      isSevenOfAKindSerial: false,
      isRepeaterRadarSerial: false,
    },
  };
});

function testSingleSerialNumber(serialNumber, patternName) {
  const pattern = new RegExp(serialNumberPatterns[patternName]);
  coolSerialPatterns.serialNumber = serialNumber;
  const isMatch = pattern.test(serialNumber);
  coolSerialPatterns.patternMatches[patternName] = isMatch;
  return coolSerialPatterns;
}

describe("Serial Patterns Testing", () => {
  describe("Single Serial Number Tests", () => {
    it("should test serial numbers against lowSerialNumber pattern", () => {
      let result = testSingleSerialNumber("00004567", "lowSerialNumberPattern");
      expect(result.patternMatches.lowSerialNumberPattern).toBe(true);
    });

    it("should test serial numbers that will not match lowSerialNumber pattern", () => {
      let result = testSingleSerialNumber("99992345", "lowSerialNumberPattern");
      expect(result.patternMatches.lowSerialNumberPattern).toBe(false);
    });

    it("should test serial numbers against highSerialNumber pattern", () => {
      let result = testSingleSerialNumber("99999933", "highSerialNumberPattern");
      expect(result.patternMatches.highSerialNumberPattern).toBe(true);
    });

    it("should test serial number dont match highSerialNumber pattern", () => {
      let result = testSingleSerialNumber("12345678", "highSerialNumberPattern");
      expect(result.patternMatches.highSerialNumberPattern).toBe(false);
    });
  });

// I reckon we will do a multiple pattern(s) test to ensure that we can test multiple serials at the same go. 

  describe("Multiple Serial Numbers Tests", () => {
    test.each([
      ["12345678", "ladderSerialPattern"],
      ["87654321", "ladderSerialPattern"],
      ["10101010", "isBinaryRadarSerialPattern"],
      // Add more test cases as needed
    ])('should test the serial number %s against the %s', (serialNumber, pattern) => {
      let result = testSingleSerialNumber(serialNumber, pattern);
      expect(result.patternMatches[pattern]).toBe(true);
    });
  });
});
