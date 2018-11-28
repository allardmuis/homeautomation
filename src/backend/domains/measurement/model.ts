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
}

interface IMeasurementTable extends ITable<IMeasurement> {
    getByDeviceAndTimeRange: (deviceId: number, from: number, to: number) => Promise<IMeasurement[]>,
}

export const measurements: IMeasurementTable = table<IMeasurement>('measurements') as IMeasurementTable;
measurements.getByDeviceAndTimeRange = async (deviceId: number, from: number, to: number) => measurements.query('deviceId', deviceId, 'timestamp', 'BETWEEN :v1 AND :v2', {':v1': from, ':v2': to});

(async () => {
    try { await createTable('measurements', {deviceId: 'N', timestamp: 'N'}); } catch (e) {}
})()

