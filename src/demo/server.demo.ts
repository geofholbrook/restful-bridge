import { createExpressApp } from "../createExpressApp";
import { initializeServer, addThingRoute1, addThingRoute2 } from './routes'

const app = createExpressApp();

const { port } = addThingRoute1(app);
addThingRoute2(app);

app.listen(port)

console.log('rest server listening on port ' + port)

/**
 * could also be this, convenient for many routes. it also runs the listen method on the defined port.
 */

// initializeServer(app);




