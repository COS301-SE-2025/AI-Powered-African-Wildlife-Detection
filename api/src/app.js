import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

app.use(express.json());

const publicRoutes = ['/auth/register', '/auth/login'];

app.use((req, res, next) => {
	// Check if the request is for a public route
	if (publicRoutes.includes(req.path)) {
		return next(); // Skip authentication for public routes
	}

	// user authentication through JWT etc. can be done here
	console.log(`Request received: ${req.method} ${req.url}`);
	next();
});

// routes go here
app.use(
	'/auth',
	proxy('http://localhost:4001', {
		proxyReqPathResolver: (req) => {
			return req.originalUrl.replace('/auth', '');
		},
	})
);

app.use(
	'/bestiary',
	proxy('http://localhost:4002', {
		proxyReqPathResolver: (req) => req.url,
	})
);

// default route for handling 404 errors
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

export default app;
