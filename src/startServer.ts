// startServer.ts

import { app } from './server/server';

const port = process.env.PORT || 3000;

let server: any; // Define the server variable outside the conditional block

// Check if the environment is test, if so, don't actually start listening
// if (process.env.NODE_ENV !== 'test') {
server = app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
// }

// Export the server variable
export { server };
