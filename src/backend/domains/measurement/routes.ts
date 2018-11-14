import * as express from 'express';
import * as controllers from './controllers';
import { asyncRoute } from '../../asyncRoute';

export const measurementRoutes = express.Router();
measurementRoutes.post('/', asyncRoute(controllers.createMeassurement));
