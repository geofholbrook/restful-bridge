import { RestfulBridge } from '../RestfulBridge';

const bridge = new RestfulBridge({
	port: 5060
});

export const [fetchIt] = bridge.createRoute<{}, { result: string }>(
	'GET',
	'/gimme',
	() => Promise.resolve({ result: 'here' }),
);

export const initializeServer = bridge.getServerInitializer()

