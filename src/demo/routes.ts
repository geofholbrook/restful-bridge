import { RestfulBridge } from '../RestfulBridge';

const bridge = new RestfulBridge({
	port: 5060
});

export const [fetchThing, addThingRoute] = bridge.createRoute<{ thing: string }, { result: string }>(
	'GET',
	'/gimme',
	params => Promise.resolve({ result: 'here: ' + params.thing }),
);

export const initializeServer = bridge.getServerInitializer()

