import * as express from 'express';
import { rooms, IRoom } from './model';
import * as Joi from 'joi';

const roomScheme = Joi.object({
    id: Joi.number().min(0).max(100).required(),
    name: Joi.string(),
    deviceId: Joi.number().min(0).max(100),
    targetTemperature: Joi.number().min(10).max(25),
});

export async function listRooms(req: express.Request, res: express.Response) {
    const list = await rooms.getAll();
    res.send(list);
}

export async function createRoom(req: express.Request, res: express.Response) {
    const { value: room, error } = Joi.validate<IRoom>(req.body, roomScheme);
    if (error) {
        throw error;
    }

    await rooms.put(room);
    res.send(room);
}

export async function updateRoom(req: express.Request, res: express.Response) {
    const { value: room, error } = Joi.validate<IRoom>(req.body, roomScheme);
    if (error) {
        throw error;
    }

    const { id, ...updates } = room;
    await rooms.updateOne(id, updates);
    res.send(room);
}

export async function deleteRoom(req: express.Request, res: express.Response) {
    await rooms.deleteOne(parseInt(req.params.id, 10));
    res.send();
}