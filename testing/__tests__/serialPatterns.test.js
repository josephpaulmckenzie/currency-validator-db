// __tests__/serialPatterns.test.js

const serialPatterns = require('../../serialPatterns');

describe('Serial Patterns Testing', () => {
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
      }
    };
  });
  function testSerialNumber(serialNumber, patternName) {
    coolSerialPatterns.serialNumber = serialNumber;
    
    const isMatch = serialPatterns[patternName].test(serialNumber);
    coolSerialPatterns.patternMatches[patternName] = isMatch;

    return coolSerialPatterns;
  }

  it('should test serial numbers against lowSerialNumber pattern', () => {
      const result = testSerialNumber('00004567', 'lowSerialNumberPattern');
    expect(result.patternMatches.lowSerialNumberPattern).toBe(true);
  });

  it('should test serial numbers against highSerialNumber pattern', () => {
    const result = testSerialNumber('99991234', 'highSerialNumberPattern');
    expect(result.patternMatches.highSerialNumberPattern).toBe(true);
  });

});
