import * as express from 'express';
import { groups, IGroup } from './model';
import * as Joi from 'joi';

const groupScheme = Joi.object({
    id: Joi.number().min(0).max(100).required(),
    name: Joi.string(),
    deviceId: Joi.number().min(0).max(100),
    deviceGroupNumber: Joi.number().min(1).max(5),
});

export async function listGroups(req: express.Request, res: express.Response) {
    const list = await groups.getAll();
    res.send(list);
}

export async function getGroup(req: express.Request, res: express.Response) {
    const device = await groups.getOne(parseInt(req.params.id, 10));
    res.send(device);
}

export async function createGroup(req: express.Request, res: express.Response) {
    const { value: group, error } = Joi.validate<IGroup>(req.body, groupScheme);
    if (error) {
        throw error;
    }

    await groups.put(group);
    res.send(group);
}

export async function updateGroup(req: express.Request, res: express.Response) {
    const { value: group, error } = Joi.validate<IGroup>(req.body, groupScheme);
    if (error) {
        throw error;
    }
    const { id, ...updates } = group;
    await groups.updateOne(id, updates);
    res.send(group);
}

export async function deleteGroup(req: express.Request, res: express.Response) {
    await groups.deleteOne(parseInt(req.params.id, 10));
    res.send();
}