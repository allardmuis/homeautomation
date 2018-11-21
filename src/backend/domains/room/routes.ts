import * as express from 'express';
import * as controllers from './controllers';
import { asyncRoute } from '../../asyncRoute';
import './handlers';

export const roomRoutes = express.Router();
roomRoutes.get('/', asyncRoute(controllers.listRooms));
roomRoutes.post('/', asyncRoute(controllers.createRoom));
roomRoutes.post('/:id', asyncRoute(controllers.updateRoom));
roomRoutes.delete('/:id', asyncRoute(controllers.deleteRoom));
