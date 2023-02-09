import fs from 'fs'
import multer from 'multer'

class UploadFile {
    private storage
    private upload

    constructor() {
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const path = `./tmp/uploads/`
                fs.mkdirSync(path, { recursive: true })
                cb(null, path)
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname)
            },
        })

        this.upload = multer({ storage: this.storage })
    }

    public single(fileName: string) {
        return this.upload.single(fileName)
    }
}

export default UploadFile
