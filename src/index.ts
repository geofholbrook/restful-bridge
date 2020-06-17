export { RestfulBridge } from './RestfulBridge';
import { isBrowser } from 'browser-or-node'

export const createExpressApp = isBrowser
	? null
	: require('./createExpressApp').createExpressApp;
