export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
        locale: string
    }
    jwt: {
        access_key: string
        algorithm: string
    }
    redis: {
        host: string
        port: number
        ttl: number
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
    base_url: {
        pdf_service: string
    }
}
