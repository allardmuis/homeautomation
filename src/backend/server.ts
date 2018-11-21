import * as express from 'express';
import * as  bodyParser from 'body-parser';
import { measurementRoutes } from './domains/measurement/routes';
import * as path from 'path';
import { errorHandler } from './errorHandler';
import { createServer, proxy } from 'aws-serverless-express';
import { deviceRoutes } from './domains/device/routes';
import { roomRoutes } from './domains/room/routes';


const PORT = process.env.PORT || 5000


function loadApp() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", process.env.ALLOW_CORS);
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
      });

    loadRoutes(app);

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(errorHandler);

    return app;
}

function loadRoutes(app: express.Express) {
    app.use('/measurements', measurementRoutes);
    app.use('/devices', deviceRoutes);
    app.use('/rooms', roomRoutes);
}

const app = loadApp();
if (process.env.LOCAL === 'true') {
    app.listen(PORT);
} else {
    const server = createServer(app);
    exports.handler = (event: any, context: any) => { proxy(server, event, context) }
}