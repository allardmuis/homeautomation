import { registerHandler, EventType } from '../../eventDispatcher';
import { IMeasurement } from '../measurement/model';
import { devices } from './model';

const createNewActiveDevice = async (measurement: IMeasurement) => {
    
    const deviceId = measurement.deviceId;
    const device = await devices.get('id', deviceId);

    if (!device) {
        devices.put({
            id: deviceId,
        })
    }
}

registerHandler(EventType.measurementCreated, createNewActiveDevice);