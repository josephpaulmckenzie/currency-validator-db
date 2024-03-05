import { app } from './server/server';

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export { server };
