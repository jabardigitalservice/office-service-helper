export interface SignInput {
    generate: {
        url: string
    }
    footers: {
        qrcode: string
        category?: string
        code: string
    }
    esigns: {
        nik: string
        passphrase: string
        tampilan?: string
        image?: boolean
    }
}
