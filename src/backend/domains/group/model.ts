import { createTable, table, ITable } from "../../dynabo";

export interface IGroup {
    id: number;
    name?: string;
    deviceId?: number;
    deviceGroupNumber?: number;
    currentTemerature?: number;
    lastMeasurement?: number;
}

type GroupUpdates = {
    [key in keyof IGroup]?: IGroup[key];
}

interface IGroupTable extends ITable<IGroup> {
    deleteOne: (id: number) => Promise<void>,
    getAll: () => Promise<IGroup[]>,
    getOne: (id: number) => Promise<IGroup | null>,
    updateOne: (id: number, updates: GroupUpdates) => Promise<void>,
}

export const groups: IGroupTable = table<IGroup>('groups') as IGroupTable;
groups.getAll = async () => groups.scan();
groups.getOne = async id => groups.get('id', id);
groups.updateOne = async (id, updates) => groups.update('id', id, updates);
groups.deleteOne = async id => groups.delete('id', id);


(async () => {
    await createTable('groups', {id: 'N'});
})()

