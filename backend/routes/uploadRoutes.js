import path from 'path';
import express from "express";
const router = express.Router()
import multer from 'multer';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb('Images only!');
    }
}

const upload = multer({
    storage, 
})

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image Uploaded',
        image: `/${req.file.path}`,
        
    })
})

export default router;