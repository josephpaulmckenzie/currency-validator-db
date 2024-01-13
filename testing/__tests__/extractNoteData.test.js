const detectText = require("../../extractNoteData");

jest.mock('@aws-sdk/client-rekognition', () => ({
  RekognitionClient: jest.fn(() => ({
    send: jest.fn(() => ({
      TextDetections:[
        {
          "detectedText": "10",
          "boundingBox": {
            "Height": 0.11051006615161896,
            "Left": 0.07212068140506744,
            "Top": 0.09201783686876297,
            "Width": 0.09968023002147675
          },
          "confidence": 96.48921966552734,
          "filteredWord": false
        },
        {
          "detectedText": "10",
          "boundingBox": {
            "Height": 0.11720877885818481,
            "Left": 0.8194473385810852,
            "Top": 0.07725970447063446,
            "Width": 0.10435104370117188
          },
          "confidence": 79.23743438720703,
          "filteredWord": false
        },
        {
          "detectedText": "PA 33831008 A",
          "boundingBox": {
            "Height": 0.11747264862060547,
            "Left": 0.09617109596729279,
            "Top": 0.19607451558113098,
            "Width": 0.2255573719739914
          },
          "confidence": 81.53697204589844,
          "filteredWord": false
        },
        {
          "detectedText": "в 32",
          "boundingBox": {
            "Height": 0.0224609375,
            "Left": 0.540026843547821,
            "Top": 0.216796875,
            "Width": 0.022365570068359375
          },
          "confidence": 91.089599609375,
          "filteredWord": false
        },
        {
          "detectedText": "A1",
          "boundingBox": {
            "Height": 0.056533098220825195,
            "Left": 0.09029419720172882,
            "Top": 0.3208545446395874,
            "Width": 0.0345277301967144
          },
          "confidence": 85.46109771728516,
          "filteredWord": false
        },
        {
          "detectedText": "PA 33831008 A",
          "boundingBox": {
            "Height": 0.07081086188554764,
            "Left": 0.6230765581130981,
            "Top": 0.602501392364502,
            "Width": 0.2063567191362381
          },
          "confidence": 95.98220825195312,
          "filteredWord": false
        },
        {
          "detectedText": "SERIES",
          "boundingBox": {
            "Height": 0.021260617300868034,
            "Left": 0.1076446995139122,
            "Top": 0.6952885389328003,
            "Width": 0.03483998775482178
          },
          "confidence": 98.82347106933594,
          "filteredWord": false
        },
        {
          "detectedText": "2017",
          "boundingBox": {
            "Height": 0.017578125,
            "Left": 0.11467437446117401,
            "Top": 0.7177734375,
            "Width": 0.02033233642578125
          },
          "confidence": 99.32259368896484,
          "filteredWord": false
        },
        {
          "detectedText": "B 2",
          "boundingBox": {
            "Height": 0.029188774526119232,
            "Left": 0.07252049446105957,
            "Top": 0.7319064140319824,
            "Width": 0.02005983516573906
          },
          "confidence": 56.585514068603516,
          "filteredWord": false
        },
        {
          "detectedText": "A",
          "boundingBox": {
            "Height": 0.017578125,
            "Left": 0.1219940185546875,
            "Top": 0.73828125,
            "Width": 0.0065063475631177425
          },
          "confidence": 98.02386474609375,
          "filteredWord": false
        },
        {
          "detectedText": "10",
          "boundingBox": {
            "Height": 0.13671875,
            "Left": 0.08458252251148224,
            "Top": 0.767578125,
            "Width": 0.07604293525218964
          },
          "confidence": 100,
          "filteredWord": false
        },
        {
          "detectedText": "10",
          "boundingBox": {
            "Height": 0.11720876395702362,
            "Left": 0.8194473385810852,
            "Top": 0.07725971937179565,
            "Width": 0.10435104370117188
          },
          "confidence": 79.23743438720703,
          "filteredWord": false
        },
        {
          "detectedText": "в",
          "boundingBox": {
            "Height": 0.0224609375,
            "Left": 0.540026843547821,
            "Top": 0.216796875,
            "Width": 0.008539581671357155
          },
          "confidence": 83.26627349853516,
          "filteredWord": false
        },
        {
          "detectedText": "A",
          "boundingBox": {
            "Height": 0.05078125,
            "Left": 0.8145133852958679,
            "Top": 0.6044921875,
            "Width": 0.014232635498046875
          },
          "confidence": 96.74779510498047,
          "filteredWord": false
        }
      ],
    })),
  })),
  DetectTextCommand: jest.fn(),
}));

describe('detectText', () => {
  test('it should detect text', async () => {
    const imagePath = "/Users/josephmckenzie/Documents/Code/currency-db/testing/test_images/10Dollar.jpg";
    const result = await detectText(imagePath,"./output.json");
    // Your assertions based on the mocked response
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    // Add more assertions as needed
  });
});
