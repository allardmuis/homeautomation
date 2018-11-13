

export function parseMeasurement(temperature: string, humidity: string, sensorId: string) {
    const temp = temperature ? parseInt(temperature, 10) : null;
    const hum = humidity ? parseInt(humidity, 10) : null;
    const sens = sensorId ? parseInt(sensorId, 10) : null;
    console.log(sens);

    if (temp !== null && (temp === NaN || temp > 100 || temp < 0 || temp+'' !== temperature)) {
        throw new Error('Temperature is not a value between 0 and 100');
    }

    if (hum !== null && (hum === NaN || hum > 100 || hum < 0 || hum+'' !== humidity)) {
        throw new Error('Humidity is not a value between 0 and 100');
    }

    if (sens !== null && (sens === NaN || sens > 100 || sens < 0 || sens+'' !== sensorId)) {
        throw new Error('SensorId is not a value between 0 and 100');
    }

    return {
        sensorId: sens,
        temperature: temp,
        humidity: hum,
    }
}