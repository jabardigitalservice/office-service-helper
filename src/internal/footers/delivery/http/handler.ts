import { NextFunction, Request, Response } from 'express'
import winston from 'winston'
import Usecase from '../../usecase/usecase'
import { validateFormRequest } from '../../../../helpers/validate'
import statusCode from '../../../../pkg/statusCode'
import { GenerateInput } from '../../entity/schema'
import error from '../../../../pkg/error'
import lang from '../../../../pkg/lang'

// This Handler just for testing
class Handler {
    constructor(private usecase: Usecase, private logger: winston.Logger) {}
    public generate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const body = await validateFormRequest(GenerateInput, req.body)

                if (!req.file) {
                    throw new error(
                        statusCode.BAD_REQUEST,
                        lang.__('common.image.file.invalid')
                    )
                }

                const generated = await this.usecase.generate(
                    body,
                    req.file.path
                )

                this.logger.info(`File Footer Generated : ${generated}`)
                res.status(statusCode.OK).json(generated)
            } catch (error) {
                this.logger.error(error)
                return next(error)
            }
        }
    }
}

export default Handler
