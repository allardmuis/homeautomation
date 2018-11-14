import * as express from 'express';


export function asyncRoute(controller: (req: express.Request, res: express.Response) => Promise<void>) {
    return (req: express.Request, res: express.Response) => {
        controller(req, res).catch(e => {
            res.status(500).send(e);
        });
    };
}