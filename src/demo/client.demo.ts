import { fetchThing1 } from './routes';

console.log('waiting 2s')

setTimeout(async () => {
	const response = await fetchThing1({ thing: 'foo' });
	console.log(response.result);
}, 2000);
