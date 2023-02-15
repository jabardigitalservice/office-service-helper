import Minio, { Client } from 'minio'
import { Config } from '../../config/config.interface'

class MinioClient {
    public minio: Client
    constructor({ minio }: Config) {
        this.minio = new Client({
            endPoint: minio.endPoint,
            port: minio.port,
            useSSL: minio.useSSL,
            accessKey: minio.accessKey,
            secretKey: minio.secretKey,
        })
    }
}

export default MinioClient
