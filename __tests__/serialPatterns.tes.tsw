import {getTextDetections} from '../src/index';
import * as fs from 'fs';
import * as path from 'path'; // Import the path module

describe('getTextDetections', () => {
  test('should return note details for valid image file', async () => {
    const filePath = './MK.jpeg';
    const noteDetails = await getTextDetections(filePath);

    expect(noteDetails).toEqual({
      validDenomination: '20',
      frontPlateId: 'FWE34',
      SerialPatternMatch: 'fourTwentySerialPattern',
      validSerialNumberPattern: 'MK07304200B',
      federalReserveId: 'K11',
      federalReserveLocation: 'Dallas, TX',
      notePositionId: 'E1',
      seriesYear: '2013',
      treasurer: 'Rios',
      secretary: 'Lew',
    });
  });

  test('should throw FileNotFoundError for non-existent file', async () => {
    const filePath = 'non_existent.jpg';
    await expect(getTextDetections(filePath)).rejects.toThrow(
      'File does not exist.'
    );
  });

  test('should detect if a JSON file exists', () => {
    // Resolve the file path using __dirname
    const resolvedFilePath = path.resolve(__dirname, 'textDetections.json');
    console.log('Resolved JSON file path:', resolvedFilePath); // Log the resolved path
    expect(fs.existsSync(resolvedFilePath)).toBe(true);
  });
});
