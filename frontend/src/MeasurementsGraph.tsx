import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import * as React from 'react';
import { Chart, HighchartsChart, LineSeries, withHighcharts, XAxis, YAxis,  } from 'react-jsx-highcharts';
import { apiRequest } from './api';


interface IMeasurementsTableProps {
    deviceId: number;
}

interface IMeasurementsTableState {
    start: number;
    end: number;
    measurements: IMeasurement[] | null;
    numberOfHours: number;
}

interface IMeasurement {
    deviceId: number;
    timestamp: number;
    temperature?: number | null;
    humidity?: number | null;
}

class MeasurementsGraphInner extends React.Component<IMeasurementsTableProps, IMeasurementsTableState> {

    constructor(props: IMeasurementsTableProps) {
        super(props);

        this.state = {
            end: new Date().getTime(),
            measurements: null,
            numberOfHours: 4,
            start: moment().subtract(4, 'hours').valueOf(),
        }
    }

    public componentWillMount() {
        this.loadMeasurements();
    }

    public render() {
        return <>
            <select value={this.state.numberOfHours} onChange={e => this.setNumberOfHours(e.target.value as any as number)}>
                <option label="1 hour1" value={1} />
                <option label="4 hours" value={4} />
                <option label="8 hours" value={8} />
                <option label="12 hours" value={12} />
                <option label="24 hours" value={24} />
                <option label="48 hours" value={48} />
                <option label="168 hours" value={168} />
            </select>
            <a href="#" onClick={() => this.loadEarlier()}>Earlier</a>
            <a href="#" onClick={() => this.loadLater()}>Later</a>
            {!this.state.measurements &&
                <span>Loading...</span>
            }
            {this.state.measurements && this.state.measurements.length === 0 &&
                <span>No data</span>
            }
            {this.state.measurements && this.state.measurements.length > 0 &&
                <HighchartsChart time={{useUTC: false}}>
                    <Chart height={600} />
                    <XAxis type="datetime">
                        <XAxis.Title>Time</XAxis.Title>
                    </XAxis>

                    <YAxis labels={{
                        style: {
                            color: '#ff5517',
                        }
                    }}>
                        <YAxis.Title style={{
                            color: '#ff5517',
                        }}>Temperature</YAxis.Title>
                        <LineSeries 
                            lineColor="#ff5517"
                            data={this.state.measurements.map(measurement => ([measurement.timestamp, measurement.temperature]))} />
                    </YAxis>
                    <YAxis opposite={true} labels={{
                        style: {
                            color: '#4f87fe',
                        }
                    }}>
                        <YAxis.Title style={{
                            color: '#4f87fe',
                        }}>Humidity</YAxis.Title>
                        <LineSeries
                            lineColor="#4f87fe"
                            data={this.state.measurements.map(measurement => ([measurement.timestamp, measurement.humidity]))} />
                    </YAxis>
                </HighchartsChart>
            }
        </>
    }


    private async loadMeasurements() {
        this.setState({ measurements: null });
        const response = await apiRequest('GET', '/devices/' + this.props.deviceId + '/measurements', { from: this.state.start, to: this.state.end });

        if (response.status === 200) {
            const measurements: IMeasurement[] = [];
            let lastTimestamp = 0; 
            for (const measurement of response.body as IMeasurement[]) {
                if (lastTimestamp > 0 && lastTimestamp < (measurement.timestamp - 600000)) {
                    measurements.push({
                        deviceId: measurement.deviceId,
                        humidity: null,
                        temperature: null,
                        timestamp: lastTimestamp + 600000,
                    });
                }
                
                measurements.push(measurement);
                lastTimestamp = measurement.timestamp;
            }

            this.setState({
                measurements,
            })
        }
    }

    private setNumberOfHours(hours: number) {
        this.setState({
            end: new Date().getTime(),
            numberOfHours: hours,
            start: moment().subtract(hours, 'hours').valueOf(),
        }, () => this.loadMeasurements());
    }

    private loadEarlier() {
        const newEnd = moment(this.state.end).subtract(this.state.numberOfHours / 2, 'hours');
        this.setState({
            end: newEnd.valueOf(),
            start: newEnd.subtract(this.state.numberOfHours, 'hours').valueOf(),
        }, () => this.loadMeasurements());
    }

    private loadLater() {
        const newEnd = moment(this.state.end).add(this.state.numberOfHours / 2, 'hours');
        this.setState({
            end: newEnd.valueOf(),
            start: newEnd.subtract(this.state.numberOfHours, 'hours').valueOf(),
        }, () => this.loadMeasurements());
    }
}

export const MeasurementsGraph = withHighcharts(MeasurementsGraphInner, Highcharts)
