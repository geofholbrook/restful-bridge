import { fetchThing } from './routes';

console.log('waiting 2s')

setTimeout(async () => {
	const response = await fetchThing({ thing: 'foo' });
	console.log(response.result);
}, 2000);
