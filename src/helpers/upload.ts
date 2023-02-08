import multer from 'multer'

export const Upload = () => {
    return multer({ dest: 'tmp/uploads/' })
}
