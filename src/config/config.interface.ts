export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        url: string
        log: string
        locale: string
    }
    jwt: {
        access_key: string
        algorithm: string
    }
    minio: {
        endPoint: string
        port: number
        useSSL: boolean
        accessKey: string
        secretKey: string
        bucketName: string
    }
    core_api: {
        url: string
    }
    gateway_service: {
        url: string
        auth: string
    }
    nats: {
        url: string
        queueName: string
        authToken: string
        subject: {
            esignProcess: string
            esignProgressUpdate: string
        }
    }
}
