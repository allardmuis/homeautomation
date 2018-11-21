import * as express from 'express';
import * as Joi from 'joi';
import { IMeasurement, measurements } from './model';
import { dispatch, EventType } from '../../eventDispatcher';

const measurementScheme = Joi.object({
    temperature: Joi.number().min(0).max(100),
    humidity: Joi.number().min(0).max(100),
    deviceId: Joi.number().min(0).max(100),
});

export async function createMeassurement(req: express.Request, res: express.Response) {
    const { value: measurement, error } = Joi.validate<IMeasurement>(req.body, measurementScheme);
    if (error) {
        throw error;
    }
    measurement.timestamp = new Date().getTime();

    await measurements.put(measurement);
    dispatch(EventType.measurementCreated, measurement);

    res.send(measurement);
}