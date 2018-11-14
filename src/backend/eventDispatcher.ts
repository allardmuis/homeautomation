export enum EventType {
    measurementCreated,
}

const handlers = {
    [EventType.measurementCreated]: [] as Function[],
};

export const registerHandler = (type: EventType, handler: (event: any) => Promise<void>) => {
    handlers[type].push(handler);
}

export const dispatch = async (type: EventType, event: any) => {
    for (const handler of handlers[type]) {
        await handler(event);
    }
}