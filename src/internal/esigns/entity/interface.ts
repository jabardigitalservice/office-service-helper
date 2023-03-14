import { EsignProgressUpdateStatus } from './enums'

export interface SignInput {
    id: string
    latestActivityId: string
    userId: string

    updateDocumentActivityInput: object
    updateDocumentInput: object
    createDocumentRevisionInput: object
    createDocumentActivityInput: object

    generate: {
        url: string
    }
    merge: {
        attachments: string[]
    }
    footers: {
        qrcode: string
        category?: string
        code: string
    }
    esigns: {
        nik: string
        passphrase?: string
        tampilan?: string
        image?: boolean
    }
}

export interface ProgressUpdatePayload {
    id: string
    latestActivityId: string
    userId: string

    updateDocumentActivityInput: object
    updateDocumentInput: object
    createDocumentRevisionInput: object
    createDocumentActivityInput: object

    status: EsignProgressUpdateStatus
    fileInfo?: {
        fileName?: string
        fileUrl?: string
    }
    message?: string
}
