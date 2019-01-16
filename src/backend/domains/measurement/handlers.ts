import { registerHandler, EventType } from '../../eventDispatcher';
import { measurements } from './model';

const deleteDeviceMeasurements = async (deviceId: number) => {
    await measurements.deleteByDeviceId(deviceId);
}

registerHandler(EventType.deviceDeleted, deleteDeviceMeasurements);