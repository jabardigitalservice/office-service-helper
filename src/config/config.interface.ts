export interface Config {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
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
    base_url: {
        pdf_service: string
    }
}
