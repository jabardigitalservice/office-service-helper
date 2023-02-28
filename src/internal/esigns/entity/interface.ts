export interface SignInput {
    fileObjectKey: string
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
