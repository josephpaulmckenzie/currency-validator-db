const previewImage = document.getElementById('previewImage');
const enlargedImage = document.getElementById('enlargedImage');
const enlargedImg = document.getElementById('enlargedImg');
const closeBtn = document.getElementById('closeBtn');

// Event listener for preview image click to toggle enlarged image overlay
previewImage.addEventListener('click', () => {
	if (enlargedImage.style.display === 'block') {
		enlargedImage.style.display = 'none'; // Hide the enlarged image overlay
	} else {
		enlargedImg.src = previewImage.src; // Set the source of the enlarged image
		enlargedImage.style.display = 'block'; // Show the enlarged image overlay
	}
});

// Add event listeners for form fields
const formFields = document.querySelectorAll('input[type="text"]');
formFields.forEach((field) => {
	let boundingBoxDrawn = false; // Track if a bounding box is drawn
	field.addEventListener('click', () => {
		if (!boundingBoxDrawn) {
			const boundingBox = getBoundingBox(field.id);
			drawBox(boundingBox);
			boundingBoxDrawn = true;
		} else {
			removeBox();
			boundingBoxDrawn = false;
		}
	});
});

// Function to remove the bounding box
function removeBox() {
	const existingBox = document.querySelector('.bounding-box');
	if (existingBox) {
		existingBox.parentNode.removeChild(existingBox);
	}
}

// Function to get bounding box coordinates based on form field id
function getBoundingBox(fieldId) {
	const detectedTextStr = '<%- JSON.stringify(detectedText) %>';
	const detectedText = JSON.parse(detectedTextStr);
	const boundingBoxDetails = detectedText[fieldId].boundingBox;
	const previewWidth = previewImage.clientWidth;
	const previewHeight = previewImage.clientHeight;
	const left = boundingBoxDetails.Left * previewWidth;
	const top = boundingBoxDetails.Top * previewHeight;
	const width = boundingBoxDetails.Width * previewWidth;
	const height = boundingBoxDetails.Height * previewHeight;
	return { left, top, width, height };
}

// Function to draw a box around the specified area on the image
function drawBox(boundingBox) {
	const box = document.createElement('div');
	box.className = 'bounding-box';
	box.style.left = `${boundingBox.left}px`;
	box.style.top = `${boundingBox.top}px`;
	box.style.width = `${boundingBox.width}px`;
	box.style.height = `${boundingBox.height}px`;
	previewImage.parentElement.appendChild(box);
}

// Add tooltips to bounding boxes on the image
document.querySelectorAll('.bounding-box').forEach((box) => {
	const tooltip = box.querySelector('.tooltip');
	box.addEventListener('mouseover', () => {
		tooltip.style.display = 'block';
	});
	box.addEventListener('mouseout', () => {
		tooltip.style.display = 'none';
	});
});
