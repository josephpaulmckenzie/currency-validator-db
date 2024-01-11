const detectText = require("../../extractNoteData");

jest.mock('@aws-sdk/client-rekognition', () => ({
  RekognitionClient: jest.fn(() => ({
    send: jest.fn(() => ({
      TextDetections: [
        {
          Confidence: 96.48921966552734,
          DetectedText: '10',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 0,
          Type: 'LINE'
        },
        {
          Confidence: 97.403564453125,
          DetectedText: 'FEDERAL',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 1,
          Type: 'LINE'
        },
        {
          Confidence: 97.73973083496094,
          DetectedText: 'RESERVE NOTE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 2,
          Type: 'LINE'
        },
        {
          Confidence: 79.23743438720703,
          DetectedText: '10',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 3,
          Type: 'LINE'
        },
        {
          Confidence: 81.53697204589844,
          DetectedText: 'PA 33831008 A',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 4,
          Type: 'LINE'
        },
        {
          Confidence: 91.089599609375,
          DetectedText: 'в 32',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 5,
          Type: 'LINE'
        },
        {
          Confidence: 98.02513885498047,
          DetectedText: 'THE UNITED STATES',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 6,
          Type: 'LINE'
        },
        {
          Confidence: 96.20365905761719,
          DetectedText: 'OF AMERICA',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 7,
          Type: 'LINE'
        },
        {
          Confidence: 85.46109771728516,
          DetectedText: 'A1',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 8,
          Type: 'LINE'
        },
        {
          Confidence: 98.31404876708984,
          DetectedText: 'UNITED FEDERAL RESERVE STATES SYSTEM',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 9,
          Type: 'LINE'
        },
        {
          Confidence: 84.57234954833984,
          DetectedText: 'DEPARTMENT THE or 1729 THE TREASURY',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 10,
          Type: 'LINE'
        },
        {
          Confidence: 55.83623123168945,
          DetectedText: 'WeY',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 11,
          Type: 'LINE'
        },
        {
          Confidence: 55.93868637084961,
          DetectedText: 'kopic',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 12,
          Type: 'LINE'
        },
        {
          Confidence: 98.76457214355469,
          DetectedText: 'THIS NOTE IS LEGAL TENDER',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 13,
          Type: 'LINE'
        },
        {
          Confidence: 95.98220825195312,
          DetectedText: 'PA 33831008 A',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 14,
          Type: 'LINE'
        },
        {
          Confidence: 98.1512451171875,
          DetectedText: 'FOR ALL DEBTS, PUBLIC AND PRIVATE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 15,
          Type: 'LINE'
        },
        {
          Confidence: 98.82347106933594,
          DetectedText: 'SERIES',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 16,
          Type: 'LINE'
        },
        {
          Confidence: 99.32259368896484,
          DetectedText: '2017',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 17,
          Type: 'LINE'
        },
        {
          Confidence: 31.31103515625,
          DetectedText: 'Jonta larreys',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 18,
          Type: 'LINE'
        },
        {
          Confidence: 63.959449768066406,
          DetectedText: 'Steven T. MNUchir',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 19,
          Type: 'LINE'
        },
        {
          Confidence: 56.585514068603516,
          DetectedText: 'B 2',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 20,
          Type: 'LINE'
        },
        {
          Confidence: 98.02386474609375,
          DetectedText: 'A',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 21,
          Type: 'LINE'
        },
        {
          Confidence: 70.72750091552734,
          DetectedText: 'Secretary of the Transyry',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 22,
          Type: 'LINE'
        },
        {
          Confidence: 93.11678314208984,
          DetectedText: 'Treasurer of the United States.',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 23,
          Type: 'LINE'
        },
        {
          Confidence: 100,
          DetectedText: '10',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 24,
          Type: 'LINE'
        },
        {
          Confidence: 93.70872497558594,
          DetectedText: 'TEN',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 25,
          Type: 'LINE'
        },
        {
          Confidence: 97.5235366821289,
          DetectedText: 'DOLLARS',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 26,
          Type: 'LINE'
        },
        {
          Confidence: 96.14665985107422,
          DetectedText: 'HAMILTON',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 27,
          Type: 'LINE'
        },
        {
          Confidence: 96.48921966552734,
          DetectedText: '10',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 28,
          ParentId: 0,
          Type: 'WORD'
        },
        {
          Confidence: 97.403564453125,
          DetectedText: 'FEDERAL',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 29,
          ParentId: 1,
          Type: 'WORD'
        },
        {
          Confidence: 97.3438491821289,
          DetectedText: 'RESERVE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 30,
          ParentId: 2,
          Type: 'WORD'
        },
        {
          Confidence: 98.1356201171875,
          DetectedText: 'NOTE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 31,
          ParentId: 2,
          Type: 'WORD'
        },
        {
          Confidence: 79.23743438720703,
          DetectedText: '10',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 32,
          ParentId: 3,
          Type: 'WORD'
        },
        {
          Confidence: 81.53697204589844,
          DetectedText: 'PA 33831008 A',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 33,
          ParentId: 4,
          Type: 'WORD'
        },
        {
          Confidence: 83.26627349853516,
          DetectedText: 'в',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 34,
          ParentId: 5,
          Type: 'WORD'
        },
        {
          Confidence: 98.91293334960938,
          DetectedText: '32',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 35,
          ParentId: 5,
          Type: 'WORD'
        },
        {
          Confidence: 98.87446594238281,
          DetectedText: 'THE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 36,
          ParentId: 6,
          Type: 'WORD'
        },
        {
          Confidence: 96.75259399414062,
          DetectedText: 'UNITED',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 37,
          ParentId: 6,
          Type: 'WORD'
        },
        {
          Confidence: 98.44834899902344,
          DetectedText: 'STATES',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 38,
          ParentId: 6,
          Type: 'WORD'
        },
        {
          Confidence: 96.20365905761719,
          DetectedText: 'OF AMERICA',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 39,
          ParentId: 7,
          Type: 'WORD'
        },
        {
          Confidence: 85.46109771728516,
          DetectedText: 'A1',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 40,
          ParentId: 8,
          Type: 'WORD'
        },
        {
          Confidence: 98.19975280761719,
          DetectedText: 'UNITED',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 41,
          ParentId: 9,
          Type: 'WORD'
        },
        {
          Confidence: 97.98686218261719,
          DetectedText: 'FEDERAL',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 42,
          ParentId: 9,
          Type: 'WORD'
        },
        {
          Confidence: 98.77946472167969,
          DetectedText: 'RESERVE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 43,
          ParentId: 9,
          Type: 'WORD'
        },
        {
          Confidence: 97.90711975097656,
          DetectedText: 'STATES',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 44,
          ParentId: 9,
          Type: 'WORD'
        },
        {
          Confidence: 98.697021484375,
          DetectedText: 'SYSTEM',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 45,
          ParentId: 9,
          Type: 'WORD'
        },
        {
          Confidence: 67.66260528564453,
          DetectedText: 'DEPARTMENT',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 46,
          ParentId: 10,
          Type: 'WORD'
        },
        {
          Confidence: 96.28182220458984,
          DetectedText: 'THE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 47,
          ParentId: 10,
          Type: 'WORD'
        },
        {
          Confidence: 91.52435302734375,
          DetectedText: 'or',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 48,
          ParentId: 10,
          Type: 'WORD'
        },
        {
          Confidence: 64.62078857421875,
          DetectedText: '1729',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 49,
          ParentId: 10,
          Type: 'WORD'
        },
        {
          Confidence: 93.3548583984375,
          DetectedText: 'THE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 50,
          ParentId: 10,
          Type: 'WORD'
        },
        {
          Confidence: 93.98966979980469,
          DetectedText: 'TREASURY',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 51,
          ParentId: 10,
          Type: 'WORD'
        },
        {
          Confidence: 55.83623123168945,
          DetectedText: 'WeY',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 52,
          ParentId: 11,
          Type: 'WORD'
        },
        {
          Confidence: 55.93868637084961,
          DetectedText: 'kopic',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 53,
          ParentId: 12,
          Type: 'WORD'
        },
        {
          Confidence: 99.40179443359375,
          DetectedText: 'THIS',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 54,
          ParentId: 13,
          Type: 'WORD'
        },
        {
          Confidence: 98.49031829833984,
          DetectedText: 'NOTE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 55,
          ParentId: 13,
          Type: 'WORD'
        },
        {
          Confidence: 99.0901107788086,
          DetectedText: 'IS',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 56,
          ParentId: 13,
          Type: 'WORD'
        },
        {
          Confidence: 98.05703735351562,
          DetectedText: 'LEGAL',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 57,
          ParentId: 13,
          Type: 'WORD'
        },
        {
          Confidence: 98.78359985351562,
          DetectedText: 'TENDER',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 58,
          ParentId: 13,
          Type: 'WORD'
        },
        {
          Confidence: 92.01262664794922,
          DetectedText: 'PA',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 59,
          ParentId: 14,
          Type: 'WORD'
        },
        {
          Confidence: 99.18621826171875,
          DetectedText: '33831008',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 60,
          ParentId: 14,
          Type: 'WORD'
        },
        {
          Confidence: 96.74779510498047,
          DetectedText: 'A',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 61,
          ParentId: 14,
          Type: 'WORD'
        },
        {
          Confidence: 98.98808288574219,
          DetectedText: 'FOR',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 62,
          ParentId: 15,
          Type: 'WORD'
        },
        {
          Confidence: 99.9402084350586,
          DetectedText: 'ALL',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 63,
          ParentId: 15,
          Type: 'WORD'
        },
        {
          Confidence: 94.10967254638672,
          DetectedText: 'DEBTS,',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 64,
          ParentId: 15,
          Type: 'WORD'
        },
        {
          Confidence: 98.34171295166016,
          DetectedText: 'PUBLIC',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 65,
          ParentId: 15,
          Type: 'WORD'
        },
        {
          Confidence: 98.55680847167969,
          DetectedText: 'AND',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 66,
          ParentId: 15,
          Type: 'WORD'
        },
        {
          Confidence: 98.97100830078125,
          DetectedText: 'PRIVATE',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 67,
          ParentId: 15,
          Type: 'WORD'
        },
        {
          Confidence: 98.82347106933594,
          DetectedText: 'SERIES',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 68,
          ParentId: 16,
          Type: 'WORD'
        },
        {
          Confidence: 99.32259368896484,
          DetectedText: '2017',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 69,
          ParentId: 17,
          Type: 'WORD'
        },
        {
          Confidence: 23.64287757873535,
          DetectedText: 'Jonta',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 70,
          ParentId: 18,
          Type: 'WORD'
        },
        {
          Confidence: 38.97919464111328,
          DetectedText: 'larreys',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 71,
          ParentId: 18,
          Type: 'WORD'
        },
        {
          Confidence: 61.21553039550781,
          DetectedText: 'Steven',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 72,
          ParentId: 19,
          Type: 'WORD'
        },
        {
          Confidence: 97.62517547607422,
          DetectedText: 'T.',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 73,
          ParentId: 19,
          Type: 'WORD'
        },
        {
          Confidence: 33.03764724731445,
          DetectedText: 'MNUchir',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 74,
          ParentId: 19,
          Type: 'WORD'
        },
        {
          Confidence: 56.585514068603516,
          DetectedText: 'B 2',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 75,
          ParentId: 20,
          Type: 'WORD'
        },
        {
          Confidence: 98.02386474609375,
          DetectedText: 'A',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 76,
          ParentId: 21,
          Type: 'WORD'
        },
        {
          Confidence: 99.019775390625,
          DetectedText: 'Secretary',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 77,
          ParentId: 22,
          Type: 'WORD'
        },
        {
          Confidence: 97.4334487915039,
          DetectedText: 'of the',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 78,
          ParentId: 22,
          Type: 'WORD'
        },
        {
          Confidence: 15.729302406311035,
          DetectedText: 'Transyry',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 79,
          ParentId: 22,
          Type: 'WORD'
        },
        {
          Confidence: 98.52165222167969,
          DetectedText: 'Treasurer',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 80,
          ParentId: 23,
          Type: 'WORD'
        },
        {
          Confidence: 98.51435089111328,
          DetectedText: 'of the',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 81,
          ParentId: 23,
          Type: 'WORD'
        },
        {
          Confidence: 96.5083999633789,
          DetectedText: 'United',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 82,
          ParentId: 23,
          Type: 'WORD'
        },
        {
          Confidence: 78.9227294921875,
          DetectedText: 'States.',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 83,
          ParentId: 23,
          Type: 'WORD'
        },
        {
          Confidence: 100,
          DetectedText: '10',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 84,
          ParentId: 24,
          Type: 'WORD'
        },
        {
          Confidence: 93.70872497558594,
          DetectedText: 'TEN',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 85,
          ParentId: 25,
          Type: 'WORD'
        },
        {
          Confidence: 97.5235366821289,
          DetectedText: 'DOLLARS',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 86,
          ParentId: 26,
          Type: 'WORD'
        },
        {
          Confidence: 96.14665985107422,
          DetectedText: 'HAMILTON',
          Geometry: { BoundingBox: [Object], Polygon: [Array] },
          Id: 87,
          ParentId: 27,
          Type: 'WORD'
        }
      ],
    })),
  })),
  DetectTextCommand: jest.fn(),
}));

describe('detectText', () => {
  test('it should detect text', async () => {
    const imagePath = "testing/test_images/10Dollar.jpg";
    const result = await detectText(imagePath);
    // Your assertions based on the mocked response
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    // Add more assertions as needed
  });
});
