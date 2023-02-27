export interface SignInput {
    fileObjectKey: string
    footers: {
        qrcode: string
        category?: string
        code: string
    }
}
