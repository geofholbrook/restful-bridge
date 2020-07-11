import { RestfulBridge } from '../RestfulBridge';

const bridge = new RestfulBridge({
	port: 5060,
});

const serveFn1 = (params: { thing: string }) => {
	console.log(params);
	return { result: 'here: ' + params.thing };
};

const serveFn2 = () => ({ result: 'here.' });

export const [fetchThing1, addThingRoute1] = bridge.createRoute('GET', '/gimme', serveFn1);

export const [fetchThing2, addThingRoute2] = bridge.createRoute('GET', '/gimme2', serveFn2);

const serveFn3 = (a: number, b: number) => ({ result: 'this causes an error' });
// export const [fetchThing3, addThingRoute3] = bridge.createRoute(
// 	'GET',
// 	'/gimme',
// 	serveFn3,
// );

export const initializeServer = bridge.getServerInitializer();
