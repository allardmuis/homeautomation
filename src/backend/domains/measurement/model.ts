import { createTable, table, ITable } from "../../dynabo";

export interface IMeasurement {
    temperature?: number;
    humidity?: number;
    deviceId: number;
    timestamp: number;
}

interface IMeasurementTable extends ITable<IMeasurement> {
    getByDeviceAndTimeRange: (deviceId: number, from: number, to: number) => Promise<IMeasurement[]>,
}

export const measurements: IMeasurementTable = table<IMeasurement>('measurements') as IMeasurementTable;
measurements.getByDeviceAndTimeRange = async (deviceId: number, from: number, to: number) => measurements.query('deviceId', deviceId, 'timestamp', 'BETWEEN :v1 AND :v2', {':v1': from, ':v2': to});

(async () => {
    try { await createTable('measurements', {deviceId: 'N', timestamp: 'N'}); } catch (e) {}
})()

