import * as express from 'express';
import { devices } from './model';

export async function listDevices(req: express.Request, res: express.Response) {
    const list = await devices.getAll();
    res.send(list);
}