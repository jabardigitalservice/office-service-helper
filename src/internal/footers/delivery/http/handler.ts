import { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import { validateFormRequest } from '../../../../helpers/validate'
import statusCode from '../../../../pkg/statusCode'
import { GenerateInput } from '../../entity/schema'

class Handler {
    constructor(private usecase: Usecase, private logger: winston.Logger) {}
    public generate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const value = validateFormRequest(GenerateInput, req.body)

                console.log(req.file)

                await this.usecase.generate(value)
                return res.status(statusCode.OK).json({ message: 'GENERATED' })
            } catch (error) {
                return next(error)
            }
        }
    }
}

export default Handler
