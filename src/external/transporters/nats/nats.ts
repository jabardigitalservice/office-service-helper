import winston from 'winston'
import { connect, ConnectionOptions, NatsConnection } from 'nats'
import { Config } from '../../../config/config.interface'

class Nats {
    public async connect(
        config: Config,
        logger: winston.Logger
    ): Promise<NatsConnection> {
        const server: ConnectionOptions = {
            servers: config.nats.url,
            token: config.nats.authToken,
        }

        const client = await connect(server)
        logger.info(`Nats Client Connected to ${client.getServer()}`)

        return client
    }
}

export default Nats
