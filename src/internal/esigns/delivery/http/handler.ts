import { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import { validateFormRequest } from '../../../../helpers/validate'
import statusCode from '../../../../pkg/statusCode'
import { SignInput } from '../../entity/schema'
import error from '../../../../pkg/error'
import lang from '../../../../pkg/lang'

class Handler {
    constructor(private usecase: Usecase, private logger: winston.Logger) {}

    public Sign() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = await validateFormRequest(SignInput, req.body)

                if (!req.file) {
                    throw new error(
                        statusCode.BAD_REQUEST,
                        lang.__('validation.any.required', { attribute: 'pdf' })
                    )
                }

                const signedFile = await this.usecase.Sign(body, req.file.path)

                this.logger.info(`File Signed : ${signedFile}`)
                res.status(statusCode.OK).json(signedFile)
            } catch (error) {
                this.logger.error(error)
                return next(error)
            }
        }
    }
}

export default Handler
