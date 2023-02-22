import { randomUUID } from 'crypto'

const createFileObject = (file: Buffer) => {
    const name = randomUUID()

    // asumsi file default extension .pdf
    const fileName = `${name}.pdf`
    const fileBuffer = file
    const metaData = {
        'Content-Type': 'application/pdf',
    }
    return {
        fileName,
        fileBuffer,
        metaData,
    }
}

export default createFileObject
