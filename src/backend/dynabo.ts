import * as AWS from 'aws-sdk';

AWS.config.update({
    region: "eu-west-1",
    signatureVersion: 'v4',
});
const dynamodb = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();
const table_prefix = process.env.TABLE_PREFIX || '';

export interface ITable<Type> {
    get: <HashKey extends keyof Type, RangeKey extends keyof Type>(hashkey: HashKey, hashValue: Type[HashKey], rangeKey?: RangeKey, rangeValue?: Type[RangeKey]) => Promise<Type | null>,
    put: (value: Type) => Promise<void>,
    query: <HashKey extends keyof Type>(hashKey: HashKey & string, hashValue: Type[HashKey] | number, rangeKey: keyof Type & string, rangeExpression?: string, rangeValues?: { [key: string]: any }) => Promise<Type[]>,
    scan: () => Promise<Type[]>,
}

export const table = <Type>(name: string): ITable<Type> => ({
    get: async (hashKey, hashValue, rangeKey?, rangeValue?) => await get(table_prefix + name, hashKey, hashValue, rangeKey, rangeValue) as Type,
    put: async (value) => await put(table_prefix + name, value),
    query: async (hashKey, hashValue, rangeKey?, rangeExpression?, rangeValues?) => await query(table_prefix + name, hashKey, hashValue, rangeKey, rangeExpression, rangeValues) as Type[],
    scan: async () => await scan(table_prefix + name) as Type[],
    //update: async (value: Type) => await update(table_prefix + name, value),
})

const get = async (table: string, hashKey: any, hashValue: any, rangeKey?: any, rangeValue?: any) => {
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
/*
// TODO AttributeUpdates is legacy, rewrite to use UpdateExpression
const update = async (table: string, value: any) => {
    console.log('dynabo update', table, value);
    return; await documentClient.update({
        TableName: table,
        AttributeUpdates: value,
    }).promise();
}
*/
export const createTable = async (name: string, keys: {[key: string]: 'N' | 'S'}) => {
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
            ReadCapacityUnits: 1, 
            WriteCapacityUnits: 1,
        },
    }).promise();
}


