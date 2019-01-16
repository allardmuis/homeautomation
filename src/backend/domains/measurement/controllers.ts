import * as express from 'express';
import * as Joi from 'joi';
import { IMeasurement, measurements } from './model';
import { dispatch, EventType } from '../../eventDispatcher';

const measurementScheme = Joi.object({
    deviceId: Joi.number().min(0).max(100).required(),
    temperature: Joi.number().min(0).max(100),
    humidity: Joi.number().min(0).max(100),
    group1: Joi.number().min(0).max(100),
    group2: Joi.number().min(0).max(100),
    group3: Joi.number().min(0).max(100),
    group4: Joi.number().min(0).max(100),
    group5: Joi.number().min(0).max(100),
    incoming: Joi.number().min(0).max(100),
});

export async function createMeassurement(req: express.Request, res: express.Response) {
    const { value: measurement, error } = Joi.validate<IMeasurement>(req.body, measurementScheme);
    if (error) {
        throw error;
    }
    measurement.timestamp = new Date().getTime();

    const hours = new Date().getHours();
    const minutes = new Date().getMinutes();
    let expireDays: number;
    if (hours === 0) {
        expireDays = 365;
    } else if (minutes % 15 === 0) {
        expireDays = 31;
    } else if (minutes % 5 === 0) {
        expireDays = 7;
    } else {
        expireDays = 2;
    }
    measurement.expires = Math.floor(new Date().getTime() / 1000) + (expireDays * 24 * 3600);

    await measurements.put(measurement);
    dispatch(EventType.measurementCreated, measurement);

    res.send(measurement);
}