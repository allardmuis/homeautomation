import * as moment from 'moment';
import * as React from 'react';
import { apiRequest } from './api';


interface IMeasurementsTableProps {
    deviceId: number;
}

interface IMeasurementsTableState {
    start: number;
    end: number;
    measurements: IMeasurement[];
}

interface IMeasurement {
    deviceId: number;
    timestamp: number;
    temperature?: number;
    humidity?: number;
}

export class MeasurementsTable extends React.Component<IMeasurementsTableProps, IMeasurementsTableState> {

    constructor(props: IMeasurementsTableProps) {
        super(props);

        this.state = {
            end: new Date().getTime(),
            measurements: [],
            start: moment().subtract(3, 'day').valueOf(),
        }
    }

    public componentWillMount() {
        this.loadMeasurements(this.props.deviceId);
    }

    public render() {
        return <table className="table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                </tr>
            </thead>
            <tbody>
                {this.state.measurements.map(measurement => 
                    <tr key={measurement.timestamp}>
                        <td>{moment(measurement.timestamp).format('YYYY-MM-DD HH:mm:ss')}</td>
                        <td>{measurement.temperature || '-'}</td>
                        <td>{measurement.humidity || '-'}</td>
                    </tr>
                )}
            </tbody>
        </table>
    }


    private async loadMeasurements(deviceId: number) {
        const response = await apiRequest('GET', '/devices/' + deviceId + '/measurements', { from: this.state.start, to: this.state.end });
        if (response.status === 200) {
            this.setState({
                measurements: response.body,
            })
        }
    }
}