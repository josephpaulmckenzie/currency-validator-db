import { noteValidators, serialNumberPatterns } from '../../services/serialPatterns';

describe('Fancy Serial Number Pattern Matching', () => {
	// Test cases for the email regex pattern
	describe('Low Serial Number Pattern', () => {
		it('should match for a low serial number', () => {
			expect(serialNumberPatterns.isLowSerialNumberPattern.test('AB00000011C')).toBe(true);
		});
	});
	describe('High Serial Number Pattern', () => {
		it('should match for a low serial number', () => {
			expect(serialNumberPatterns.isHighSerialNumberPattern.test('AB99999911C')).toBe(true);
		});
	});
	describe('Ladder Serial Number Pattern', () => {
		it('should match for a ladder serial number', () => {
			expect(serialNumberPatterns.isLadderSerialPattern.test('A12345678D')).toBe(true);
		});
	});
	describe('Solid Number Serial Number Pattern', () => {
		it('should match for a ladder pattern', () => {
			expect(serialNumberPatterns.isASolidNumberSerialPattern.test('A11111111D')).toBe(true);
		});
	});

	describe('Radar Serial Number Pattern', () => {
		it('should match for a radar pattern', () => {
			expect(serialNumberPatterns.isRadarSerialPattern.test('DB01100110C')).toBe(true);
		});
	});
	describe('Super Radar Serial Number Pattern', () => {
		it('should match for a super radar pattern', () => {
			expect(serialNumberPatterns.isSuperRadarSerialPattern.test('AB12222221B')).toBe(true);
		});
	});
	describe('Super Repeater Serial Number Pattern', () => {
		it('should match for a super radar pattern', () => {
			expect(serialNumberPatterns.isSuperRepeaterSerialPattern.test('A02020202D')).toBe(true);
		});
	});
	describe('Double Quad Serial Number Pattern', () => {
		it('should match for a double quad pattern', () => {
			expect(serialNumberPatterns.isDoubleQuadSerialPattern.test('BE08800880C')).toBe(true);
		});
	});
	describe('7 in a row Serial Number Pattern', () => {
		it('should match for a 7 exact numbers in row pattern', () => {
			expect(serialNumberPatterns.isSevenInArowSerialPattern.test('A11111110D')).toBe(true);
		});
	});
	describe('7 of a kind Serial Number Pattern', () => {
		it('should match for a 7 of a kind pattern', () => {
			expect(serialNumberPatterns.isSevenOfAKindSerialPattern.test('A11111110D')).toBe(true);
		});
	});
	describe('Binary Serial Number Pattern', () => {
		it('should match for a binary pattern', () => {
			expect(serialNumberPatterns.isBinarySerialPattern.test('AB12122112E')).toBe(true);
		});
	});
	describe('True Binary Serial Number Pattern', () => {
		it('should match for a true binary pattern', () => {
			expect(serialNumberPatterns.isTrueBinarySerialPattern.test('A01010101D')).toBe(true);
		});
	});
	describe('420 Serial Number Pattern', () => {
		it('should match for a serial number with the number 420 in it', () => {
			expect(serialNumberPatterns.fourTwentySerialPattern.test('ME12342001D')).toBe(true);
		});
	});
});

describe('Note Validators', () => {
	// Test cases for the validSerialNumberPattern regular expression
	describe('Valid Serial Number Pattern', () => {
		it('should match valid serial numbers', () => {
			expect(noteValidators.validSerialNumberPattern.test('AB12345678C')).toBe(true);
			expect(noteValidators.validSerialNumberPattern.test('AB 12345678 C')).toBe(true);
			expect(noteValidators.validSerialNumberPattern.test('PA42003287 D')).toBe(true);
			expect(noteValidators.validSerialNumberPattern.test('LD 56709823E')).toBe(true);
		});

		it('should not match invalid serial numbers', () => {
			// Add test cases for invalid serial numbers here
		});
	});

	// Test cases for the federalReserveId regular expression
	describe('Federal Reserve ID', () => {
		it('should match valid Federal Reserve IDs', () => {
			expect(noteValidators.federalReserveId.test('A1')).toBe(true);
			expect(noteValidators.federalReserveId.test('B12')).toBe(true);
			expect(noteValidators.federalReserveId.test('L2')).toBe(true);
		});

		it('should not match invalid Federal Reserve IDs', () => {
			// Add test cases for invalid Federal Reserve IDs here
		});
	});

	// Test cases for the notePositionId regular expression
	describe('Note Position ID', () => {
		it('should match valid note position IDs', () => {
			expect(noteValidators.notePositionId.test('F3')).toBe(true);
			expect(noteValidators.notePositionId.test('B2')).toBe(true);
			expect(noteValidators.notePositionId.test('H 2')).toBe(true);
		});

		it('should not match invalid note position IDs', () => {
			// Add test cases for invalid note position IDs here
		});
	});

	// Test cases for the frontPlateId regular expression
	describe('Front Plate ID', () => {
		it('should match valid front plate IDs', () => {
			expect(noteValidators.frontPlateId.test('FW A 1')).toBe(true);
			expect(noteValidators.frontPlateId.test('B2')).toBe(true);
			expect(noteValidators.frontPlateId.test('E 5')).toBe(true);
			expect(noteValidators.frontPlateId.test('FW B999')).toBe(true);
		});

		it('should not match invalid front plate IDs', () => {
			expect(noteValidators.frontPlateId.test('FW L 122')).toBe(false);
		});
	});

	// Test cases for the validDenomination regular expression
	describe('Valid Denomination', () => {
		it('should match valid denominations', () => {
			expect(noteValidators.validDenomination.test('1')).toBe(true);
			expect(noteValidators.validDenomination.test('2')).toBe(true);
			expect(noteValidators.validDenomination.test('5')).toBe(true);
			expect(noteValidators.validDenomination.test('10')).toBe(true);
			expect(noteValidators.validDenomination.test('20')).toBe(true);
			expect(noteValidators.validDenomination.test('50')).toBe(true);
			expect(noteValidators.validDenomination.test('100')).toBe(true);
		});

		it('should not match invalid denominations', () => {
			// Add test cases for invalid denominations here
		});
	});

	// Test cases for the Treasurer regular expression
	describe('Treasurer', () => {
		it('should match Treasurer', () => {
			expect(noteValidators.Treasurer.test('Treasurer')).toBe(true);
		});

		it('should not match other strings', () => {
			// Add test cases for other strings here
		});
	});

	// Test cases for the Secretary regular expression
	describe('Secretary', () => {
		it('should match Secretary', () => {
			expect(noteValidators.Secretary.test('Secretary')).toBe(true);
		});

		it('should not match other strings', () => {
			// Add test cases for other strings here
		});
	});
});
