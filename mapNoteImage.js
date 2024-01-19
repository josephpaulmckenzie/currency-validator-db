const sharp = require("sharp");
const detectText = require("./extractNoteData");
const outputPath = "./output.json";

async function annotateImage(pathToSavedImage) {
  try {
    const imageBuffer = await sharp(pathToSavedImage).toBuffer();
    const metadata = await sharp(imageBuffer).metadata();
    const noteData = await detectText("./testing/test_images/IMG_2426.jpg", outputPath);

    if (!noteData || !Array.isArray(noteData)) {
      throw new Error("Note data is not in the expected format or is empty.");
    }

    const borderWidth = 2; 
    const borderColors = { r: 255, g: 0, b: 0, alpha: 255 }; // Red border color
    const labelColor = { r: 255, g: 255, b: 255, alpha: 255 }; // White label color

    const borderComposites = [];

    noteData.forEach(({ detectedText, boundingBox }) => {
      const left = Math.floor(boundingBox.Left * metadata.width);
      const top = Math.floor(boundingBox.Top * metadata.height);
      const width = Math.floor(boundingBox.Width * metadata.width);
      const height = Math.floor(boundingBox.Height * metadata.height);

      const borderRectangles = [
        {
          input: {
            create: {
              width: width + borderWidth * 2,
              height: borderWidth,
              channels: 4,
              background: borderColors,
            },
          },
          top: top - borderWidth,
          left: left - borderWidth,
          blend: "over",
        },
        {
          input: {
            create: {
              width: borderWidth,
              height: height + borderWidth * 2,
              channels: 4,
              background: borderColors,
            },
          },
          top: top - borderWidth,
          left: left - borderWidth,
          blend: "over",
        },
        {
          input: {
            create: {
              width: width + borderWidth * 2,
              height: borderWidth,
              channels: 4,
              background: borderColors,
            },
          },
          top: top + height,
          left: left - borderWidth,
          blend: "over",
        },
        {
          input: {
            create: {
              width: borderWidth,
              height: height + borderWidth * 2,
              channels: 4,
              background: borderColors,
            },
          },
          top: top - borderWidth,
          left: left + width,
          blend: "over",
        },
      ];

      borderComposites.push(...borderRectangles);

      // Label text for the bounding box
      borderComposites.push({
        input: Buffer.from(
          `<svg width="${width * 0.8}" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fill="black">${detectedText}</text></svg>`
        ),
        top: top - 30, 
        left: left - borderWidth, 
        blend: "over",
      });
    });

    const annotatedImageBuffer = await sharp(imageBuffer)
      .composite(borderComposites)
      .toBuffer();

    return annotatedImageBuffer;
  } catch (err) {
    console.error("Error annotating image:", err);
    throw err;
  }
}

annotateImage("./testing/test_images/IMG_2426.jpg")
  .then((annotatedBuffer) => {
    sharp(annotatedBuffer).toFile("./annotated_image.jpg");
  })
  .catch((error) => {
    console.error("An error occurred during image annotation:", error);
  });