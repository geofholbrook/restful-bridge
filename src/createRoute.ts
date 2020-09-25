import { Express } from 'express';

export function createGetRoute(
	app: Express,
	url: string,
	getter: (...params: any) => any,
	verbose = true,
) {
	app.get(url, async (req, res) => {
		if (verbose) {
			console.log(req.hostname, 'GET', req.url);
		}
		const response = await getter(req.query);
		res.end(JSON.stringify(response));
	});
}

export function createPostRoute(
	app: Express,
	url: string,
	handler: (...params: any) => any,
	verbose = true,
) {
	app.post(url, async (req, res) => {
		if (verbose) {
			console.log(req.hostname, 'POST', req.url);
		}
		const response = await handler(req.body);
		res.end(JSON.stringify(response));
	});
}
