// import {config, Rekognition} from 'aws-sdk';
// import {readFileSync, writeFileSync} from 'fs';
// import sharp from 'sharp';
// config.update({region: 'us-east-1'});
// const rekognition = new Rekognition();
// async function detectText(imageBytes: Buffer) {
//   const params = {
//     Image: {Bytes: imageBytes},
//   };
//   return rekognition.detectText(params).promise();
// }
// async function autoCropImage(imageBytes: Buffer, margin = 150) {
//   try {
//     // Get image metadata
//     const metadata = await sharp(imageBytes).metadata();
//     const imageWidth = metadata.width;
//     const imageHeight = metadata.height;
//     // Detect text in the image
//     const data = await detectText(imageBytes);
//     const textDetections = data.TextDetections;
//     if (!textDetections) {
//       throw new Error('Text not detected in the image');
//     }
//     // Initialize crop coordinates
//     let minX = imageWidth,
//       minY = imageHeight,
//       maxX = 0,
//       maxY = 0;
//     // Iterate through all text detections to find the bounding box
//     textDetections.forEach(detection => {
//       const geometry = detection.Geometry.BoundingBox;
//       minX = Math.min(minX, geometry.Left * imageWidth - margin);
//       minY = Math.min(minY, geometry.Top * imageHeight - margin);
//       maxX = Math.max(
//         maxX,
//         (geometry.Left + geometry.Width) * imageWidth + margin
//       );
//       maxY = Math.max(
//         maxY,
//         (geometry.Top + geometry.Height) * imageHeight + margin
//       );
//     });
//     // Crop image using sharp
//     const croppedImageBuffer = await sharp(imageBytes)
//       .extract({
//         left: Math.max(0, Math.floor(minX)),
//         top: Math.max(0, Math.floor(minY)),
//         width: Math.min(imageWidth, Math.floor(maxX - minX)),
//         height: Math.min(imageHeight, Math.floor(maxY - minY)),
//       })
//       .toBuffer();
//     return croppedImageBuffer;
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }
// async function processImage(imagePath: string) {
//   try {
//     const imageBytes = readFileSync(imagePath);
//     const croppedImage = await autoCropImage(imageBytes);
//     writeFileSync('./cropped-image22.jpg', croppedImage);
//     return './cropped-image22.jpg'; // Return the path of the cropped image upon success
//   } catch (error) {
//     console.error('Error:', error);
//     throw error;
//   }
// }
// export {processImage};
