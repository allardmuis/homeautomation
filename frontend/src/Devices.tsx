import * as React from 'react';
import { NavLink, Route } from "react-router-dom";
import { apiRequest } from './api';
import { ContentBody } from './ContentBody';
import { Device } from './Device';
import { SideBar } from './SideBar';

interface IDevice {
    id: number;
    name: string | null;
}

interface IDeviceListState {
    devices: IDevice[];
}

export class Devices extends React.Component<{}, IDeviceListState> {

    constructor(props: any) {
        super(props);
        this.state = {
            devices: [],
        }
    }

    public async componentWillMount() {
        await this.loadDeviceList();
    }

    public render() {
        return <>
            <SideBar>
                {this.state.devices.map(device => (
                    <li className="nav-item" key={device.id}>
                        <NavLink className="nav-link" to={`/devices/${device.id}`}>{device.id}{device.name && ': ' + device.name}</NavLink>
                    </li>
                ))}
            </SideBar>
            <ContentBody>
                <Route path='/devices/:id' component={Device} />
            </ContentBody>
        </>;
    }

    private async loadDeviceList() {
        const response = await apiRequest('GET', '/devices');
        if (response.status === 200) {
            this.setState({
                devices: response.body,
            })
        }
    }
}