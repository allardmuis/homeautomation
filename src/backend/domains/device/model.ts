import { createTable, table, ITable } from "../../dynabo";

export interface IDevice {
    id: number;
    name?: string;
    location?: string;
}

type DeviceUpdates = {
    [key in keyof IDevice]?: IDevice[key];
}

interface IDeviceTable extends ITable<IDevice> {
    getAll: () => Promise<IDevice[]>,
    getOne: (id: number) => Promise<IDevice | null>,
    updateOne: (id: number, updates: DeviceUpdates) => Promise<void>,
}

export const devices: IDeviceTable = table<IDevice>('devices') as IDeviceTable;
devices.getAll = async () => devices.scan();
devices.getOne = async id => devices.get('id', id);
devices.updateOne = async (id, updates) => devices.update('id', id, updates);

(async () => {
    try { await createTable('devices', {id: 'N'}); } catch (e) {}
})()

