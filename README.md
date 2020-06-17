# restful-bridge
Create matching REST methods for client and server, strongly typed and without duplication.

## usage

In a common file required by both the server and client (e.g. `routes.ts`), create an instance of the RestfulBridge class

```
import { RestfulBridge } from '../RestfulBridge';

const bridge = new RestfulBridge({
    hostname: "site.com",
	port: 5060,
    apiPrefix: "/api/v2",
});
```

Calls to the createRoute method return an array of two elements: a function that makes the request, and a function that adds the route to an express server. The types for request parameters and response (probably JSON objects) must be specified. 

```
export const [fetchThing, addThingRoute] = bridge.createRoute<{ thing: string }, { result: string }>(
	'GET',
	'/gimme',
	params => Promise.resolve({ result: 'here: ' + params.thing }),
);
```

The client can import and use fetchThing as a stand-alone function:

```
// client.ts
import { fetchThing } from './routes.ts'
const response = await fetchThing({ thing: 'foo' });
```

The server must create its own express app (although this package does include a convenience function `createExpressApp`), and apply the route-adding function to it. That function returns the bridge options, so we can for example access the port number.

```
// server.ts
import { addFetchRoute } from './routes.ts'
const app = createExpressApp();
const options = addThingRoute(app);
app.listen(options.port);
```

`routes.ts` can also export an initializer that adds all the routes creates, and listens at the correct port.

```
export const initializeServer = bridge.getServerInitializer()
```

then `server.ts` becomes:

```
import { initializeServer } from './routes.ts'
const app = createExpressApp();
initializeServer(app);
```









