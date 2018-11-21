import * as express from 'express';
import { devices, IDevice } from './model';
import { measurements } from '../measurement/model';
import * as Joi from 'joi';

const deviceScheme = Joi.object({
    id: Joi.number().min(0).max(100),
    name: Joi.string(),
    location: Joi.string(),
});


export async function listDevices(req: express.Request, res: express.Response) {
    const list = await devices.getAll();
    res.send(list);
}

export async function getDevice(req: express.Request, res: express.Response) {
    const device = await devices.getOne(parseInt(req.params.id, 10));
    res.send(device);
}

export async function updateDevice(req: express.Request, res: express.Response) {
    const { value: device, error } = Joi.validate<IDevice>(req.body, deviceScheme);
    if (error) {
        throw error;
    }
    const { id, ...updates } = device;
    await devices.updateOne(device.id, updates);
    res.send(device);
}

export async function listMeasurements(req: express.Request, res: express.Response) {
    const deviceId = parseInt(req.params.id, 10);
    const from = parseInt(req.query.from, 10) || new Date().getTime() - 60000;
    const to = parseInt(req.query.to, 10) || new Date().getTime();
    
    const list = await measurements.getByDeviceAndTimeRange(deviceId, from, to)
    res.send(list);
}

