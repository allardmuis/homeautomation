import * as Joi from 'joi';
import * as Express from 'express';

function errorIsValidationError(error: object): error is Joi.ValidationError {
    return (error as Joi.ValidationError).isJoi !== undefined && (error as Joi.ValidationError).isJoi;
}

export function errorHandler(error: object, req: Express.Request, res: Express.Response, next: (error: Error) => void) {
    if (errorIsValidationError(error)) {
        res.status(400);
        res.send(error.message);
    }   
}