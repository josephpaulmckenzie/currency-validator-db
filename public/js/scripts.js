document.getElementById('uploadForm').addEventListener('submit', async function (event) {
	event.preventDefault();

	const fileInput = document.getElementById('fileInput');
	const file = fileInput.files[0];

	if (!file) {
		alert('Please select a file');
		return;
	}

	const formData = new FormData();
	formData.append('image', file);

	const progress = document.getElementById('progress');
	const loaderContainer = document.querySelector('.loader-container');

	try {
		loaderContainer.style.display = 'block'; // Show loader

		const response = await fetch('/upload', {
			method: 'POST',
			body: formData,
			// Enable upload progress tracking
			onUploadProgress: function (event) {
				const progressPercentage = Math.round((event.loaded / event.total) * 100);
				progress.style.width = progressPercentage + '%';
			},
		});

		if (!response.ok) {
			throw new Error('Failed to upload image');
		}

		const responseData = await response.json();
		// console.log(responseData);

		window.location.href = '/success';
	} catch (error) {
		console.error('Error:', error);
		alert('Failed to upload image. Please try again.');
	} finally {
		// Hide loader after upload completes or fails
		loaderContainer.style.display = 'none';
	}
});

document.addEventListener('DOMContentLoaded', function () {
	const urlParams = new URLSearchParams(window.location.search);
	const success = urlParams.get('success');

	if (success === 'true') {
		// Display success message
		document.getElementById('successMessage').style.display = 'block';
	}
});
