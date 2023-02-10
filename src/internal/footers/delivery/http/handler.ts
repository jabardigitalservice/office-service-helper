import { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import { validateFormRequest } from '../../../../helpers/validate'
import statusCode from '../../../../pkg/statusCode'
import { GenerateInput } from '../../entity/schema'
import error from '../../../../pkg/error'
import lang from '../../../../pkg/lang'

class Handler {
    constructor(private usecase: Usecase, private logger: winston.Logger) {}

    public Generate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = await validateFormRequest(GenerateInput, req.body)

                if (!req.file) {
                    throw new error(
                        statusCode.BAD_REQUEST,
                        lang.__('validation.any.required', { attribute: 'pdf' })
                    )
                }

                const generatedFile = await this.usecase.Generate(
                    body,
                    req.file.path
                )

                this.logger.info(`File Footer Generated : ${generatedFile}`)
                res.status(statusCode.OK).json(generatedFile)
            } catch (error) {
                this.logger.error(error)
                return next(error)
            }
        }
    }
}

export default Handler
