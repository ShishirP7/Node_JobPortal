const multer = require('multer')
const fs = require('fs')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = "uploads/"
        if (req.image_path) {
            path = req.image_path
        }
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })

        }
        cb(null, path)
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "_" + file.originalname
        cb(null, filename)
    }
})

const uploader = multer({ storage: storage })
module.exports = uploader;