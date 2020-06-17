export { RestfulBridge } from './RestfulBridge';
import 'dotenv/config';

export const createExpressApp = process.env.IN_BROWSER
	? null
	: require('./createExpressApp').createExpressApp;
