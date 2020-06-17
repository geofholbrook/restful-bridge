import { createExpressApp } from "../createExpressApp";
import { initializeServer, addThingRoute } from './routes'

const app = createExpressApp();
const { port } = addThingRoute(app);
app.listen(port)
console.log('rest serfver listening on port ' + port)

/**
 * could also be this, convenient for many routes. it also runs the listen method on the defined port.
 */

// initializeServer(app);




