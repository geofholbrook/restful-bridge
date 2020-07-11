import { Express } from 'express';
import { createGetRoute, createPostRoute } from './createRoute';
import { doJsonGet, doJsonPost } from './doRequest';

type FirstArgument<T> = T extends (arg: infer U) => any ? U : any;
type StripPromise<T> = T extends Promise<infer U> ? U : T;

type ParamsType<T> = FirstArgument<T>;
type ResponseType<T> = T extends (...args: any[]) => any ? StripPromise<ReturnType<T>> : never;

type MaybePromise<T> = Promise<T> | T;

class Options {
	hostname: string = 'http://localhost';
	port: number = 4040;

	// these will override the port property ... use if listen and request ports are different (because of proxies, for example)
	listenPort?: number;
	requestPort?: number;

	apiPrefix: string = '/api/v1';
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

	public createRoute<TParams = null, TResponse = null>(
		method: 'GET' | 'POST',
		route: string,
		serveFn: (params: TParams | any) => Promise<TResponse | any>,
	): [
		typeof serveFn extends () => any
			? () => MaybePromise<TResponse | ResponseType<typeof serveFn>>
			: (
					params: TParams | ParamsType<typeof serveFn>,
			  ) => MaybePromise<TResponse | ResponseType<typeof serveFn>>,
		(app: Express) => Options,
	] {
		if (route[0] !== '/') {
			throw new Error('routes must begin with a slash');
		}

		const fetcher = (params: TParams) =>
			method === 'GET'
				? doJsonGet<TResponse>(this.getRemoteURL(route), params)
				: doJsonPost<TResponse>(this.getRemoteURL(route), params);

		const serverRouteAdder = (app: Express) => {
			method === 'GET'
				? createGetRoute(app, this.getRouteURL(route), serveFn)
				: createPostRoute(app, this.getRouteURL(route), serveFn);
			return this.options;
		};

		this.routeAdders.push(serverRouteAdder);

		return [fetcher, serverRouteAdder];
	}

	public getServerInitializer() {
		return (app: Express) => {
			this.routeAdders.forEach((adder) => adder(app));
			app.listen(this.options.listenPort);
			console.log('REST server listening on port', this.options.listenPort);
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
