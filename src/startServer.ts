import { app } from './server/server';

const startServer = () => {
	const port = process.env.PORT || 3089;

	const server = app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});

	// Return the server instance for testing or other purposes
	return server;
};

// Start the server if the environment is not 'test'
if (process.env.NODE_ENV !== 'test') {
	startServer();
}

// Export the startServer function in case you need to manually start the server elsewhere
export { startServer };
