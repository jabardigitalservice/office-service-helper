import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import {
    validate,
    validateGeneratePdfRequest,
} from '../../../../helpers/validate'
import { Generate } from '../../entity/schema'
import UseCase from '../../usecase/usecase'

class Handler {
    constructor(private usecase: UseCase) {}

    public generatePdf() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const value = validateGeneratePdfRequest(Generate, req.query)

                const responseBody = await this.usecase.generatePdf(value.url)
                return res.status(httpStatus.OK).send(responseBody)
            } catch (error) {
                return next()
            }
        }
    }
}

export default Handler
