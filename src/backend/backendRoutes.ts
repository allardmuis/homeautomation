import * as express from 'express';
import * as messurements from './domains/measurement/controllers';

export const backendRoutes = express.Router();
backendRoutes.post('/measurements', messurements.createMeassurement);
