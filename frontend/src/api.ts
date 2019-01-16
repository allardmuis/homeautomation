
export interface IParams { 
    [key: string]: number | string;
}

export async function apiRequest(method: 'POST' | 'GET' | 'DELETE', url: string, params?: IParams) {

    if (process.env.NODE_ENV === 'development') {
        url = 'http://localhost:5000'+ url;
    } else if (process.env.NODE_ENV === 'production') {
        url = '/test'+ url;
    }

    if (method === 'GET') {
        return await get(url, params || {});
    }

    if (method === 'DELETE') {
        return await del(url, params || {});
    }

    return await post(url, params || {});
}

async function get(url: string, params: IParams) {
    Object.keys(params).map((key, i) => {
        url += (i === 0 ? '?' : '&') + key + '=' + params[key];
    });

    const response = await fetch(url);
    return {
        body: await parseBody(response),
        status: response.status,
    }
}

async function del(url: string, params: IParams) {
    Object.keys(params).map((key, i) => {
        url += (i === 0 ? '?' : '&') + key + '=' + params[key];
    });

    const response = await fetch(url, {
        method: 'DELETE',
    });
    return {
        body: await parseBody(response),
        status: response.status,
    }
}

async function post(url: string, params: IParams) {
    
    const response = await fetch(url, {
        body: JSON.stringify(params),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        method: 'POST',
    });

    return {
        body: await parseBody(response),
        status: response.status,
    }
}

async function parseBody(response: Response) {
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.startsWith('application/json')) {
        return await response.json();
    } else {
        return await response.text();
    }
}