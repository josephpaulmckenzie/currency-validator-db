// startServer.ts

import { Server, IncomingMessage, ServerResponse } from 'http';
import { app } from './server/server';

const port = process.env.PORT || 3000;

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

export function startServer(): void {
	// Check if the environment is test, if so, don't actually start listening
	// if (process.env.NODE_ENV !== 'test') {
	server = app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
	});
	// }
}

export function closeServer(): void {
	// Close the server if it's running
	if (server) {
		server.close();
	}
}
