// __tests__/serialPatterns.test.js

const serialPatterns = require('../../serialPatterns');

describe('Serial Patterns Testing', () => {
  let coolSerialPatterns;
    let result;
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
      result = testSerialNumber('00004567', 'lowSerialNumberPattern');
    expect(result.patternMatches.lowSerialNumberPattern).toBe(true);
  });

  it('should test serial numbers against highSerialNumber pattern', () => {
     result = testSerialNumber('99991234', 'highSerialNumberPattern');
    expect(result.patternMatches.highSerialNumberPattern).toBe(true);
  });
    
  it('should test serial numbers for laddder pattern', () => {
     result = testSerialNumber('12345678', 'ladderSerialPattern');
      expect(result.patternMatches.ladderSerialPattern).toBe(true);
      
  });
    
    

});
