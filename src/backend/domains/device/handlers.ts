import { registerHandler, EventType } from '../../eventDispatcher';
import { IMeasurement } from '../measurement/model';
import { devices } from './model';
const onMeasurementCreated = async (measurement: IMeasurement) => {
    const deviceId = measurement.deviceId;
    const device = await devices.get('id', deviceId);
    console.log(device);
    if (!device) {
        devices.put({
            id: deviceId,
        })
    }
}

registerHandler(EventType.measurementCreated, onMeasurementCreated);