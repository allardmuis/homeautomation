import * as express from 'express';
import * as Joi from 'joi';

export function asyncRoute(controller: (req: express.Request, res: express.Response) => Promise<void>) {
    return (req: express.Request, res: express.Response) => {
        controller(req, res).catch(e => {

            if (errorIsValidationError(e)) {
                res.status(400);
            } else {
                res.status(500);
            }

            console.log(e);
            res.send(e.message);
        });
    };
}

function errorIsValidationError(error: object): error is Joi.ValidationError {
    return (error as Joi.ValidationError).isJoi !== undefined && (error as Joi.ValidationError).isJoi;
}