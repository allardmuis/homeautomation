import { registerHandler, EventType } from '../../eventDispatcher';
import { IMeasurement } from '../measurement/model';
import { groups } from './model';

const updateGroupValues = async (measurement: IMeasurement) => {
    
    if (measurement.group1 || measurement.group2 || measurement.group3 || measurement.group4 || measurement.group5) {
        const deviceId = measurement.deviceId;

        const allGroups = await groups.getAll();
        for (const group of allGroups) {
            if (group.deviceId === deviceId) {
                const groupKey = 'group' + group.deviceGroupNumber as 'group1' | 'group2' | 'group3' | 'group4' | 'group5';
                if (measurement[groupKey]) {
                    group.currentTemerature = measurement[groupKey];
                    group.lastMeasurement = measurement.timestamp;
                    const { id, ...updates } = group;
                    groups.updateOne(id, updates);
                }
            }
        }
    }
}

registerHandler(EventType.measurementCreated, updateGroupValues);