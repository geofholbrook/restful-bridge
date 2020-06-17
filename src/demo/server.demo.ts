import { createExpressApp } from "../createExpressApp";
import { initializeServer } from './routes'

const app = createExpressApp();
initializeServer(app);




