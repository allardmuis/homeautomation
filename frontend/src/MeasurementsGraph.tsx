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
    measurements: IMeasurement[];
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
            measurements: [],
            start: moment().subtract(1, 'days').valueOf(),
        }
    }

    public componentWillMount() {
        this.loadMeasurements(this.props.deviceId);
    }

    public render() {
        return <>
            {this.state.measurements.length > 0 &&
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


    private async loadMeasurements(deviceId: number) {
        const response = await apiRequest('GET', '/devices/' + deviceId + '/measurements', { from: this.state.start, to: this.state.end });

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
}

export const MeasurementsGraph = withHighcharts(MeasurementsGraphInner, Highcharts)
