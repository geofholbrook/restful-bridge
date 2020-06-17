import { Express } from 'express';
import { createGetRoute, createPostRoute } from './createRoute';
import { doJsonGet, doJsonPost } from './doRequest';

export class RestfulBridge {
	hostname: string = 'http://localhost';
	port: number = 4040;
	apiPrefix: string = '/api/v1';

	routeAdders: Array<(app: Express) => void> = [];

	constructor(options?: { hostname?: string; port?: number; apiPrefix?: string }) {
		if (options) {
			if (options.hostname) this.hostname = options.hostname;
			if (options.port) this.port = options.port;
			if (options.apiPrefix) {
				if (options.apiPrefix[0] !== '/') {
					throw new Error('apiPrefix option must begin with a slash');
				}
				this.apiPrefix = options.apiPrefix;
			}
		}
	}

	public createRoute<TParams, TResponse>(
		method: 'GET' | 'POST',
		route: string,
		serveFn: (params: TParams) => Promise<TResponse>,
	): [
		(params: TParams) => Promise<TResponse>,
		(app: Express) => void
	] {
		if (route[0] !== '/') {
			throw new Error('routes must begin with a slash');
		}

		const fetcher = (params: TParams) => method === 'GET'
			? doJsonGet<TResponse>(this.getRemoteURL(route), params)
			: doJsonPost<TResponse>(this.getRemoteURL(route), params);

		const serverRouteAdder = (app: Express) => {method === 'GET'
			? createGetRoute(app, this.getRouteURL(route), serveFn)
			: createPostRoute(app, this.getRouteURL(route), serveFn)
			return {
				hostname: this.hostname,
				port: this.port,
				apiPrefix: this.apiPrefix
			}
		};

		this.routeAdders.push(serverRouteAdder)

		return [
			fetcher,
			serverRouteAdder,
		];
	}

	public getServerInitializer() {
		return (app: Express) => {
			this.routeAdders.forEach(adder => adder(app))
			app.listen(this.port);
			console.log('REST server listening on port', this.port)
		}
	}

	private getRemoteURL(route: string) {
		return this.hostname + ':' + this.port.toString() + this.apiPrefix + route;
	}

	private getRouteURL(route: string) {
		return this.apiPrefix + route;
	}


}
