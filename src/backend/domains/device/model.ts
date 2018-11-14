import { createTable, table, ITable } from "../../dynabo";

export interface IDevice {
    id: number;
}

interface IDeviceTable extends ITable<IDevice> {
    getAll: () => Promise<IDevice[]>,
}

export const devices: IDeviceTable = table<IDevice>('devices') as IDeviceTable;

(async () => {
    try { await createTable('devices', {id: 'N'}); } catch (e) {}
})()

