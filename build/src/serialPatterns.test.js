"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const client_rekognition_1 = require("@aws-sdk/client-rekognition"); // We import this to ensure typing
const fs = require("fs");
jest.mock('@aws-sdk/client-rekognition');
describe('getTextDetections', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    test('should return note details for valid image file', async () => {
        // Mock the RekognitionClient.send method
        client_rekognition_1.RekognitionClient.mockImplementationOnce(() => ({
            send: jest.fn().mockResolvedValue({
                TextDetections: [{ DetectedText: 'Mocked text' }],
            }),
        }));
        // Read the detected text file dynamically using a relative path
        const detectedTextFilePath = './textDetections.json';
        console.log('Resolved file path:', detectedTextFilePath);
        const detectedTextBuffer = fs.readFileSync(detectedTextFilePath);
        const detectedText = JSON.parse(detectedTextBuffer.toString());
        // Call getTextDetections with the detected text
        const noteDetails = await (0, index_1.getTextDetections)(detectedText);
        // Add your assertions for the expected noteDetails
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
    // Add other test cases as needed
});
//# sourceMappingURL=serialPatterns.test.js.map