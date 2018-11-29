import * as  moment from 'moment';
import * as React from 'react';
import { NavLink } from "react-router-dom";
import { apiRequest, IParams } from './api';
import { IDevice } from './Device';

interface IGroup {
    id: number;
    name?: string | null;
    deviceId?: number;
    deviceGroupNumber?: number;
    currentTemerature?: number;
    lastMeasurement?: number;
}

interface IGroupListState {
    groups: IGroup[] | null;
    addGroup: IGroup | null;
    devices: IDevice[];
}

export class Groups extends React.Component<{}, IGroupListState> {

    private reloadInterval: number;
    constructor(props: any) {
        super(props);
        this.state = {
            addGroup: null,
            devices: [],
            groups: null,
        }
    }

    public componentWillMount() {
        this.loadGroups();
        this.loadDevices();
        this.reloadInterval = window.setInterval(
            () => this.loadGroups(),
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
                {!this.state.groups && <span>Loading...</span>}
                {this.state.groups && this.state.groups.map(group => 
                    <div className="card" style={{width: '18rem'}} key={group.id}>
                        <div className="card-body">
                            <h5 className="card-title">{group.name}</h5>
                            <dt>Device</dt><dd>
                                {this.state.devices.length > 0 && group.deviceId && 
                                    <NavLink to={`/devices/${group.deviceId}`}>{this.state.devices.find(device => device.id === group.deviceId)!.name}</NavLink>
                                }
                            </dd>
                            <dt>Group number</dt>
                            <dd>{group.deviceGroupNumber}</dd>
                            <dt>Current temperature</dt><dd>{group.currentTemerature || '?'}</dd>
                            <dt>Last meassurement</dt><dd>{group.lastMeasurement ? moment(group.lastMeasurement).format('YYYY-MM-DD HH:mm:ss') : '?'}</dd>
                        </div>
                    </div>
                )}
                {this.state.groups && !this.state.addGroup && <a href="#" onClick={() => this.setState({ addGroup: { id: (this.state.groups!.map(group => group.id).sort((a, b) => b - a)[0] || 0) + 1} })}>Add group</a>}
                {this.state.addGroup &&
                    <div className="card" style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">Add group</h5>
                            <label>Id: <input type="number" value={this.state.addGroup.id} onChange={(e) => this.changeAdd('id', parseInt(e.target.value, 10))} /></label>
                            <label>Name: <input type="text" value={this.state.addGroup.name || ''} onChange={(e) => this.changeAdd('name', e.target.value)} /></label>
                            <label>Device: <select value={this.state.addGroup.deviceId} onChange={(e) => this.changeAdd('deviceId', e.target.value as any as number)} >
                                    <option />
                                    {this.state.devices.map(device => <option value={device.id}>{device.name}</option>)}
                                </select>
                            </label>
                            <label>Group number: <input type="number" value={this.state.addGroup.deviceGroupNumber} onChange={(e) => this.changeAdd('deviceGroupNumber', parseInt(e.target.value, 10))} /></label>
                            <a href="#" onClick={() => this.addGroup()}>Add</a>
                        </div>
                    </div>
                }
            </div>
        </>;
    }

    private async loadGroups() {
        const response = await apiRequest('GET', '/groups');
        if (response.status === 200) {
            this.setState({
                groups: response.body,
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

    private changeAdd<Name extends keyof IGroup>(name: Name, value: IGroup[Name]) {
        this.setState({ addGroup: { ...this.state.addGroup!, [name]: value }});
    }

    private async addGroup() {
        const response = await apiRequest('POST', '/groups', this.state.addGroup as any as IParams);
        if (response.status === 200) {
            this.setState({
                addGroup: null,
                groups: [...(this.state.groups || []), response.body],
            });
        }
    }
}