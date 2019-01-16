import { createTable, table, ITable } from "../../dynabo";

export interface IMeasurement {
    deviceId: number;
    timestamp: number;
    temperature?: number;
    humidity?: number;
    group1?: number;
    group2?: number;
    group3?: number;
    group4?: number;
    group5?: number;
    incoming?: number;
    expires: number;
}

interface IMeasurementTable extends ITable<IMeasurement> {
    getByDeviceAndTimeRange: (deviceId: number, from: number, to: number) => Promise<IMeasurement[]>,
    deleteByDeviceId: (deviceId: number) => Promise<void>,
}

export const measurements: IMeasurementTable = table<IMeasurement>('measurements') as IMeasurementTable;
measurements.getByDeviceAndTimeRange = async (deviceId: number, from: number, to: number) => measurements.query('deviceId', deviceId, 'timestamp', 'BETWEEN :v1 AND :v2', {':v1': from, ':v2': to});
measurements.deleteByDeviceId = async (deviceId: number) => {
    let list: IMeasurement[] | undefined = undefined;
    while (!list || list.length > 0) {
        list = await measurements.query('deviceId', deviceId);
        console.log('remaining meassurements: ' + list.length);
        for (const item of list) {
            await measurements.delete('deviceId', item.deviceId, 'timestamp', item.timestamp);
        }
        console.log('deleted ' + list.length);
    }
}

(async () => {
    await createTable('measurements', {deviceId: 'N', timestamp: 'N'}, {
        readCapacityUnits: 2,
        writeCapacityUnits: 3,
        ttlAttribute: 'expires',
    });
})()

