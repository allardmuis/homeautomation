import * as express from 'express';
import * as controllers from './controllers';
import { asyncRoute } from '../../asyncRoute';
import './handlers';

export const groupRoutes = express.Router();
groupRoutes.get('/', asyncRoute(controllers.listGroups));
groupRoutes.get('/:id', asyncRoute(controllers.getGroup));
groupRoutes.post('/', asyncRoute(controllers.createGroup));
groupRoutes.post('/:id', asyncRoute(controllers.updateGroup));
groupRoutes.delete('/:id', asyncRoute(controllers.deleteGroup));
