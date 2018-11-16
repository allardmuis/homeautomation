import { createTable, table, ITable } from "../../dynabo";

export interface IDevice {
    id: number;
}

interface IDeviceTable extends ITable<IDevice> {
    getAll: () => Promise<IDevice[]>,
    getOne: (id: number) => Promise<IDevice | null>,
}

export const devices: IDeviceTable = table<IDevice>('devices') as IDeviceTable;
devices.getAll = async () => devices.scan();
devices.getOne = async (id: number) => devices.get('id', id);


(async () => {
    try { await createTable('devices', {id: 'N'}); } catch (e) {}
})()

