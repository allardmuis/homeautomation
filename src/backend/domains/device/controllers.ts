import * as express from 'express';
import { devices } from './model';
import { measurements } from '../measurement/model';

export async function listDevices(req: express.Request, res: express.Response) {
    const list = await devices.getAll();
    res.send(list);
}

export async function listMeasurements(req: express.Request, res: express.Response) {
    const deviceId = parseInt(req.params.id, 10);
    const from = parseInt(req.query.from, 10) || new Date().getTime() - 60000;
    const to = parseInt(req.query.to, 10) || new Date().getTime();
    
    const list = await measurements.getByDeviceAndTimeRange(deviceId, from, to)
    res.send(list);
}

