import { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import { validateFormRequest } from '../../../../helpers/validate'
import statusCode from '../../../../pkg/statusCode'
import { SignInput } from '../../entity/schema'

class Handler {
    constructor(private usecase: Usecase, private logger: winston.Logger) {}

    public Sign() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = await validateFormRequest(SignInput, req.body)
                const signedFile = await this.usecase.Sign(body)

                res.status(statusCode.OK).json(signedFile)
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
