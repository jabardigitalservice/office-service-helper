import winston from 'winston'
import { GenerateInput } from '../entity/interface'

class Usecase {
    constructor(private logger: winston.Logger) {}

    public async generate(body: GenerateInput) {
        console.log('USECASE CALLED')
    }
}

export default Usecase
