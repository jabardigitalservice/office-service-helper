import { EsignProgressUpdateStatus } from './enums'

export interface SignInput {
    id: string
    generate: {
        url: string
        attachmentUrl: string
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

export interface ProgressUpdatePayload {
    id: string
    status: EsignProgressUpdateStatus
    fileInfo?: {
        fileName?: string
        fileUrl?: string
    }
    message?: string
}
