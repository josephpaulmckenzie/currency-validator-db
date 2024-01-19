function sevenOfAKind(number) {
    const digitCounts = {};
      let pattern;
  
    for (const digit of number) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
    }

  
    const result = {
      serialNumber: number,
        matches: Object.entries(digitCounts).map(([digit, count]) => {
            pattern = "No Match";
          if (count === 7) {
            pattern = "isSevenOfAKindSerialPattern";
        }
      }),
    };
  
    // console.log(result.matches);
    return pattern;
  }
  
// console.log(sevenOfAKind("5535555"));
  
module.exports = { sevenOfAKind };
  