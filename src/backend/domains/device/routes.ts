import * as express from 'express';
import * as controllers from './controllers';
import { asyncRoute } from '../../asyncRoute';
import './handlers';

export const deviceRoutes = express.Router();
deviceRoutes.get('/', asyncRoute(controllers.listDevices));
deviceRoutes.get('/:id', asyncRoute(controllers.getDevice));
deviceRoutes.post('/:id', asyncRoute(controllers.updateDevice));
deviceRoutes.get('/:id/measurements', asyncRoute(controllers.listMeasurements));
