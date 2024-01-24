const { serialNumberPatterns } = require("../../serialPatterns");

let coolSerialPatterns;

beforeEach(() => {
  coolSerialPatterns = {
    serialNumber: "",
    patternMatches: {
      validSerialNumberPattern: false,
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
``
function testSingleSerialNumber(serialNumber, patternName) {
  const pattern = new RegExp(serialNumberPatterns[patternName]);
  coolSerialPatterns.serialNumber = serialNumber;
  const isMatch = pattern.test(serialNumber);
  coolSerialPatterns.patternMatches[patternName] = isMatch;
  return coolSerialPatterns;
}

describe("Serial Patterns Testing", () => {
  describe("Single Serial Number Tests", () => {


    it("should test serial number for boring", () => {
      let result = testSingleSerialNumber("AB12344567C", "validSerialNumberPattern");
      expect(result.patternMatches.validSerialNumberPattern).toBe(true);
    });

    it("should test serial numbers against lowSerialNumber pattern", () => {
      let result = testSingleSerialNumber("AB00004567C", "lowSerialNumberPattern");
      expect(result.patternMatches.lowSerialNumberPattern).toBe(true);
    });

    it("should test serial numbers that will not match lowSerialNumber pattern", () => {
      let result = testSingleSerialNumber("AB99992345D", "lowSerialNumberPattern");
      expect(result.patternMatches.lowSerialNumberPattern).toBe(false);
    });

    it("should test serial numbers against highSerialNumber pattern", () => {
      let result = testSingleSerialNumber("MA99999933D", "highSerialNumberPattern");
      expect(result.patternMatches.highSerialNumberPattern).toBe(true);
    });

    it("should test serial number dont match highSerialNumber pattern", () => {
      let result = testSingleSerialNumber("MC12345678A", "highSerialNumberPattern");
      expect(result.patternMatches.highSerialNumberPattern).toBe(false);
    });

    it("should test a serial number for one that is a 420 note", () => {
      let result = testSingleSerialNumber("LK54342093C", "containsNumber420Pattern");
      expect(result.patternMatches.containsNumber420Pattern).toBe(true);
    });

  });

// I reckon we will do a multiple pattern(s) test to ensure that we can test multiple serials at the same go. 

  describe("Multiple Serial Numbers Tests", () => {
    test.each([
      ["MK12345678D", "ladderSerialPattern"],
      ["MC87654321E", "ladderSerialPattern"],
      ["AB10101010F", "isBinaryRadarSerialPattern"],
    ])('should test the serial number %s against the %s', (serialNumber, pattern) => {
      let result = testSingleSerialNumber(serialNumber, pattern);
      expect(result.patternMatches[pattern]).toBe(true);
    });
  });
});
