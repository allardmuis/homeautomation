import * as express from 'express';
import * as  bodyParser from 'body-parser';
import { backendRoutes } from './backendRoutes';
import * as path from 'path';
import { errorHandler } from './errorHandler';

const PORT = process.env.PORT || 5000


async function loadApp() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(express.static(__dirname + '/public'));
    app.use('/backend', backendRoutes);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(errorHandler);
    app.listen(PORT);
}

loadApp();