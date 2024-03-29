import { Express } from 'express';
import { createGetRoute, createPostRoute } from './createRoute';
import { doJsonGet, doJsonPost } from './doRequest';
import { isBrowser } from 'browser-or-node';

type StripPromise<T> = T extends Promise<infer U> ? U : T;

class Options {
	hostname: string = 'http://localhost';
	port: number = 4040;

	// these will override the port property ... use if listen and request ports are different (because of proxies, for example)
	listenPort?: number;
	requestPort?: number;

	apiPrefix: string = '/api/v1';

	verboseServer: boolean = true;
	verboseClient: boolean = true;
}

export class RestfulBridge {
	options: Options;
	routeAdders: Array<(app: Express) => Options> = [];

	constructor(options?: Partial<Options>) {
		this.options = { ...new Options(), ...options };

		if (!this.options.listenPort) this.options.listenPort = this.options.port;
		if (!this.options.requestPort) this.options.requestPort = this.options.port;

		if (this.options.apiPrefix[0] !== '/') {
			throw new Error('apiPrefix option must begin with a slash');
		}
	}

	public createRoute<TParams, TResponse>(
		method: 'GET' | 'POST',
		route: string,
		serveFn: (params: TParams) => TResponse | Promise<TResponse>,
	): [(params: TParams) => Promise<StripPromise<TResponse>>, (app: Express) => Options] {
		if (route[0] !== '/') {
			throw new Error('routes must begin with a slash');
		}

		const fetcher = (params: TParams) =>
			method === 'GET'
				? doJsonGet<StripPromise<TResponse>>(this.getRemoteURL(route), params || {}, this.options.verboseClient)
				: doJsonPost<StripPromise<TResponse>>(this.getRemoteURL(route), params || {}, this.options.verboseClient);

		if (isBrowser) {
			return [fetcher, null as unknown as (app: Express) => Options]
		}

		if (serveFn.length > 1) {
			throw new Error('server function must have a single argument, or none');
		}

		const serverRouteAdder =
			!isBrowser &&
			((app: Express) => {
				if (this.options.verboseServer) {
					console.log('adding route', route)
				}

				method === 'GET'
					? createGetRoute(app, this.getRouteURL(route), serveFn, this.options.verboseServer)
					: createPostRoute(app, this.getRouteURL(route), serveFn, this.options.verboseServer);
				return this.options;
			});

		this.routeAdders.push(serverRouteAdder);

		return [fetcher, serverRouteAdder];
	}

	public getServerInitializer() {
		return (app: Express, listen = true) => {
			this.routeAdders.forEach((adder) => {
				adder(app)
			});
			
			if (listen) {
				app.listen(this.options.listenPort);
				console.log('REST server listening on port', this.options.listenPort)
			}
		};
	}

	private getRemoteURL(route: string) {
		return (
			this.options.hostname +
			':' +
			this.options.requestPort!.toString() +
			this.options.apiPrefix +
			route
		);
	}

	private getRouteURL(route: string) {
		return this.options.apiPrefix + route;
	}
}
