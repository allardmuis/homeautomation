import * as  moment from 'moment';
import * as React from 'react';
import { apiRequest, IParams } from './api';
import { IDevice } from './Device';

interface IRoom {
    id: number;
    name?: string | null;
    deviceId?: number;
    currentTemerature?: number;
    currentHumidity?: number;
    lastMeasurement?: number;
}

interface IRoomListState {
    rooms: IRoom[] | null;
    addRoom: IRoom | null;
    devices: IDevice[];
}

export class Rooms extends React.Component<{}, IRoomListState> {

    private reloadInterval: number;
    constructor(props: any) {
        super(props);
        this.state = {
            addRoom: null,
            devices: [],
            rooms: null,
        }
    }

    public componentWillMount() {
        this.loadRooms();
        this.loadDevices();
        this.reloadInterval = window.setInterval(
            () => this.loadRooms(),
            1000 * 60,
        );
    }

    public componentWillUnmount() {
        if (this.reloadInterval) {
            window.clearInterval(this.reloadInterval);
        }
    }

    public render() {
        return <>
            <div className="col">
                {!this.state.rooms && <span>Loading...</span>}
                {this.state.rooms && this.state.rooms.map(room => 
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">{room.name}</h5>
                            <dt>Device</dt><dd>{(this.state.devices.find(device => device.id === room.deviceId) || {name: ''}).name}</dd>
                            <dt>Current temperature</dt><dd>{room.currentTemerature || '?'}</dd>
                            <dt>Current humidity</dt><dd>{room.currentHumidity || '?'}</dd>
                            <dt>Last meassurement</dt><dd>{room.lastMeasurement ? moment(room.lastMeasurement).format('YYYY-MM-DD HH:mm:ss') : '?'}</dd>
                        </div>
                    </div>
                )}
                {this.state.rooms && !this.state.addRoom && <a href="#" onClick={() => this.setState({ addRoom: { id: (this.state.rooms!.map(room => room.id).sort()[0] || 0) + 1} })}>Add room</a>}
                {this.state.addRoom &&
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Add room</h5>
                            <label>Id: <input type="text" value={this.state.addRoom.id} onChange={(e) => this.changeAdd('id', parseInt(e.target.value, 10))} /></label>
                            <label>Name: <input type="text" value={this.state.addRoom.name || ''} onChange={(e) => this.changeAdd('name', e.target.value)} /></label>
                            <label>Device: <select value={this.state.addRoom.deviceId} onChange={(e) => this.changeAdd('deviceId', e.target.value as any as number)} >
                                    <option />
                                    {this.state.devices.map(device => <option value={device.id}>{device.name}</option>)}
                                </select>
                            </label>
                            <a href="#" onClick={() => this.addRoom()}>Add</a>
                        </div>
                    </div>
                }
            </div>
        </>;
    }

    private async loadRooms() {
        const response = await apiRequest('GET', '/rooms');
        if (response.status === 200) {
            this.setState({
                rooms: response.body,
            })
        }
    }

    private async loadDevices() {
        const response = await apiRequest('GET', '/devices');
        if (response.status === 200) {
            this.setState({
                devices: response.body,
            })
        }
    }

    private changeAdd<Name extends keyof IRoom>(name: Name, value: IRoom[Name]) {
        this.setState({ addRoom: { ...this.state.addRoom!, [name]: value }});
    }

    private async addRoom() {
        const response = await apiRequest('POST', '/rooms', this.state.addRoom as any as IParams);
        if (response.status === 200) {
            this.setState({
                addRoom: null,
                rooms: [...(this.state.rooms || []), response.body!],
            });
        }
    }
}