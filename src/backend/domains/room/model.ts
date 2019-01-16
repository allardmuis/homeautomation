import { createTable, table, ITable } from "../../dynabo";

export interface IRoom {
    id: number;
    name?: string;
    deviceId?: number;
    currentTemerature?: number;
    currentHumidity?: number;
    lastMeasurement?: number;
    targetTemperature?: number;
}

type RoomUpdates = {
    [key in keyof IRoom]?: IRoom[key];
}

interface IRoomTable extends ITable<IRoom> {
    deleteOne: (id: number) => Promise<void>,
    getAll: () => Promise<IRoom[]>,
    getOne: (id: number) => Promise<IRoom | null>,
    updateOne: (id: number, updates: RoomUpdates) => Promise<void>,
}

export const rooms: IRoomTable = table<IRoom>('rooms') as IRoomTable;
rooms.getAll = async () => rooms.scan();
rooms.getOne = async id => rooms.get('id', id);
rooms.updateOne = async (id, updates) => rooms.update('id', id, updates);
rooms.deleteOne = async id => rooms.delete('id', id);

(async () => {
    await createTable('rooms', {id: 'N'});
})()

