import * as express from 'express';
import { Koi } from '@ksyos/koi';

const measurementScheme = Koi.object({
    temperature: Koi.numberAsString().min(0).max(100),
    humidity: Koi.numberAsString().min(0).max(100),
    sensorId: Koi.numberAsString().min(0).max(100),
});

export function createMeassurement(req: express.Request, res: express.Response) {
    
    const { value: measurement, error } = Koi.validate(req.body, measurementScheme);
    if (error) {
        throw error;
    }
    
    res.send(measurement);
}