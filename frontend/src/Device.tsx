import * as React from 'react';
import { match } from 'react-router-dom';
import { apiRequest, IParams } from './api';
import { EditField } from './EditField';
import { MeasurementsGraph } from './MeasurementsGraph';
import { MeasurementsTable } from './MeasurementsTable';

interface IDeviceProps {
    match: match<{ id: string }>
}

interface IDevice {
    id: number;
    name?: string;
    location?: string;
}

interface IDeviceState {
    device: IDevice | null;
    editing: keyof IDevice | null;
    editValue: string;
    graphOrTable: 'graph' | 'table';
}

export class Device extends React.Component<IDeviceProps, IDeviceState> {

    constructor(props: IDeviceProps) {
        super(props);
        this.state = {
            device: null,
            editValue: '',
            editing: null,
            graphOrTable: 'graph',
        };
    }

    public async componentWillMount() {
        await this.loadDevice(parseInt(this.props.match.params.id, 10));
    }

    public async componentWillReceiveProps(newProps: IDeviceProps) {
        if (newProps.match.params.id !== this.props.match.params.id) {
            await this.loadDevice(parseInt(newProps.match.params.id, 10));
        }
    }

    public render() {
        return <>
            {this.state.device && <>
                <div className="row">
                    <div className="col">
                        <h1 className="display-4">Device {this.state.device.id}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <label>Name</label>
                    </div>
                    <div className="col-5">
                        <EditField value={this.state.device.name || ''} update={name => this.update('name', name)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <label>Location</label>
                    </div>
                    <div className="col-5">
                        <EditField value={this.state.device.location || ''} update={location => this.update('location', location)} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {this.state.graphOrTable === 'graph' && <a href="#" onClick={()=>this.setState({graphOrTable: 'table'})}>Show table</a>}
                        {this.state.graphOrTable === 'table' && <a href="#" onClick={()=>this.setState({graphOrTable: 'graph'})}>Show graph</a>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        {this.state.graphOrTable === 'table' && <MeasurementsTable deviceId={this.state.device.id} />}
                        {this.state.graphOrTable === 'graph' && <MeasurementsGraph deviceId={this.state.device.id} />}
                    </div>
                </div>
            </>}
        </>
    }

    private async loadDevice(id: number) {
        const response = await apiRequest('GET', '/devices/' + id);
        if (response.status === 200) {
            this.setState({
                device: response.body,
            })
        }
    }

    private update(name: keyof IDevice, value: string) {
        this.setState({
            device: { ...this.state.device!, [name]: value }
        });
        apiRequest('POST', '/devices/' + this.state.device!.id, this.state.device as unknown as IParams);
    }
}
