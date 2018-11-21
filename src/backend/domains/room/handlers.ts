import { registerHandler, EventType } from '../../eventDispatcher';
import { IMeasurement } from '../measurement/model';
import { devices } from '../device/model';
import { rooms } from './model';

const updateRoomValues = async (measurement: IMeasurement) => {
    
    if (measurement.temperature || measurement.humidity) {
        const deviceId = measurement.deviceId;
        const device = await devices.get('id', deviceId);

        if (device) {
            const allRooms = await rooms.getAll();
            for (const room of allRooms) {
                if (room.deviceId === device.id) {
                    room.currentHumidity = measurement.humidity;
                    room.currentTemerature = measurement.temperature;
                    room.lastMeasurement = measurement.timestamp;
                    const { id, ...updates } = room;
                    rooms.updateOne(id, updates);
                }
            }
        }
    }
}

registerHandler(EventType.measurementCreated, updateRoomValues);