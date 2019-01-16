import * as AWS from 'aws-sdk';

AWS.config.update({
    region: "eu-west-1",
    signatureVersion: 'v4',
});
const dynamodb = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();
const table_prefix = process.env.TABLE_PREFIX || '';


export interface ITable<Type> {
    delete: <HashKey extends keyof Type & string, RangeKey extends keyof Type & string>(hashkey: HashKey, hashValue: Type[HashKey], rangeKey?: RangeKey, rangeValue?: Type[RangeKey]) => Promise<void>,
    get: <HashKey extends keyof Type & string, RangeKey extends keyof Type & string>(hashkey: HashKey, hashValue: Type[HashKey], rangeKey?: RangeKey, rangeValue?: Type[RangeKey]) => Promise<Type | null>,
    put: (value: Type) => Promise<void>,
    query: <HashKey extends keyof Type>(hashKey: HashKey & string, hashValue: Type[HashKey] | number, rangeKey?: keyof Type & string, rangeExpression?: string, rangeValues?: { [key: string]: any }) => Promise<Type[]>,
    scan: () => Promise<Type[]>,
    update: <HashKey extends keyof Type & string, RangeKey extends keyof Type & string>(hashkey: HashKey, hashValue: Type[HashKey], updates: {[key: string]: any}, rangeKey?: RangeKey, rangeValue?: Type[RangeKey]) => Promise<void>,
}

export const table = <Type>(name: string): ITable<Type> => ({
    delete: async (hashKey, hashValue, rangeKey?, rangeValue?) => await del(table_prefix + name, hashKey, hashValue, rangeKey, rangeValue),
    get: async (hashKey, hashValue, rangeKey?, rangeValue?) => await get(table_prefix + name, hashKey, hashValue, rangeKey, rangeValue) as Type,
    put: async (value) => await put(table_prefix + name, value),
    query: async (hashKey, hashValue, rangeKey?, rangeExpression?, rangeValues?) => await query(table_prefix + name, hashKey, hashValue, rangeKey, rangeExpression, rangeValues) as Type[],
    scan: async () => await scan(table_prefix + name) as Type[],
    update: async (hashKey, hashValue, updates, rangeKey?, rangeValue?) => await update(table_prefix + name, hashKey, hashValue, updates, rangeKey, rangeValue),
})

const get = async (table: string, hashKey: string, hashValue: any, rangeKey?: string, rangeValue?: any) => {
    console.log('dynabo get', table, hashKey, hashValue, rangeKey, rangeValue);
    const key = {
        [hashKey]: hashValue
    };
    if (rangeKey && rangeValue) {
        key[rangeKey] = rangeValue;
    }
    return (await documentClient.get({
        TableName: table,
        Key: key,
    }).promise()).Item;
}

const put = async (table: string, value: any) => {
    console.log('dynabo put', table_prefix + table, value);
    await documentClient.put({
        TableName: table,
        Item: value,
    }).promise();
}

const query = async (table: string, hashKey: string, hashValue: any, rangeKey?: string, rangeExpression?: string, rangeValues?: { [key: string]: any }) => {
    
    let conditionExpression =  '#hashKeyName = :hkey';
    let conditionValues: { [key: string]: string | number } = { ':hkey': hashValue };
    let keyNames: { [key: string]: string } = {'#hashKeyName': hashKey }
    if (rangeKey && rangeExpression && rangeValues) {
        conditionExpression += ' and #rangeKeyName ' + rangeExpression;
        conditionValues = { ...conditionValues, ...rangeValues };
        keyNames['#rangeKeyName'] = rangeKey;
    }
    console.log('dynabo query', table, hashValue, rangeExpression, conditionExpression, conditionValues, keyNames);
    
    return (await documentClient.query({
        TableName: table,
        KeyConditionExpression: conditionExpression,
        ExpressionAttributeNames: keyNames,
        ExpressionAttributeValues: conditionValues,
    }).promise()).Items!;
}


// TODO build filter expressions
const scan = async (table: string) => {
    console.log('dynabo scan', table);
    return (await documentClient.scan({
        TableName: table,
    }).promise()).Items;
}

const update = async (table: string, hashKey: string, hashValue: any, updates: {[key: string]: any}, rangeKey?: string, rangeValue?: any) => {
    
    const key = {
        [hashKey]: hashValue,
    };
    if (rangeKey && rangeValue) {
        key[rangeKey] = rangeValue;
    }
    const updateExpression = 'SET ' + Object.keys(updates).map(key => '#' + key + ' = :' + key).join(', ');
    const expressionAttributeValues: {[key: string]: string} = {};
    const expressionAttributeNames: {[key: string]: string} = {};
    for (const key of Object.keys(updates)) {
        expressionAttributeNames['#' + key] = key;
        expressionAttributeValues[':' + key] = updates[key];
    }

    console.log('dynabo update', table, key, updateExpression, expressionAttributeNames, expressionAttributeValues);
    await documentClient.update({
        TableName: table,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
    }).promise();
}

const del = async (table: string, hashKey: string, hashValue: any, rangeKey?: string, rangeValue?: any) => {
    const key = {
        [hashKey]: hashValue,
    };
    if (rangeKey && rangeValue) {
        key[rangeKey] = rangeValue;
    }

    console.log('dynabo delete', table, key);
    await documentClient.delete({
        TableName: table,
        Key: key,
    }).promise();
}

interface ITableOptions {
    readCapacityUnits?: number;
    writeCapacityUnits?: number;
    ttlAttribute?: string;
}

export const createTable = async (name: string, keys: {[key: string]: 'N' | 'S'}, options?: ITableOptions) => {
    
    const tables = await dynamodb.listTables().promise();
    if (tables.TableNames && tables.TableNames.includes(table_prefix + name)) {
        return;
    }

    await dynamodb.createTable({
        TableName: table_prefix + name,
        AttributeDefinitions: Object.keys(keys).map(key => (
            {
                AttributeName: key,
                AttributeType: keys[key]
            }
        )),
        KeySchema: Object.keys(keys).map((key, i) => (
            {
                AttributeName: key,
                KeyType: i === 0 ? "HASH" : "RANGE",
            }
        )),
        ProvisionedThroughput: {
            ReadCapacityUnits: options && options.readCapacityUnits || 1, 
            WriteCapacityUnits: options && options.writeCapacityUnits || 1,
        },
    }).promise();
    
    if (options && options.ttlAttribute) {
        await new Promise(resolve => setTimeout(resolve, 10000));

        await dynamodb.updateTimeToLive({
            TableName: table_prefix + name,
            TimeToLiveSpecification: { 
                AttributeName: options && options.ttlAttribute,
                Enabled: true,
            }
        }).promise();
    }
}


