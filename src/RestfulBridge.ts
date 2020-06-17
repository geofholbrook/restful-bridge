import { Express } from 'express';
import { createGetRoute, createPostRoute } from './createRoute';
import { doJsonGet, doJsonPost } from './doRequest';

class Options {
	hostname: string = 'http://localhost';
	port: number = 4040;
	apiPrefix: string = '/api/v1';
}

export class RestfulBridge {
	options: Options;
	routeAdders: Array<(app: Express) => Options> = [];

	constructor(options?: Partial<Options>) {
		this.options = {...new Options(), ...options }
		
		if (this.options.apiPrefix[0] !== '/') {
			throw new Error('apiPrefix option must begin with a slash');
		}
	}

	public createRoute<TParams, TResponse>(
		method: 'GET' | 'POST',
		route: string,
		serveFn: (params: TParams) => Promise<TResponse>,
	): [
		(params: TParams) => Promise<TResponse>,
		(app: Express) => Options
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
			return this.options
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
			app.listen(this.options.port);
			console.log('REST server listening on port', this.options.port)
		}
	}

	private getRemoteURL(route: string) {
		return this.options.hostname + ':' + this.options.port.toString() + this.options.apiPrefix + route;
	}

	private getRouteURL(route: string) {
		return this.options.apiPrefix + route;
	}
}
