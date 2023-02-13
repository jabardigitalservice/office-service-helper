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
    pdf_service: {
        url: string
    }
    esign_service: {
        auth: string
        cookies: string
        nik: string
        url: string
    }
}
