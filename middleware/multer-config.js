const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

const upload = multer({ storage }).single('image');

const resizeImage = async (req, res, next) => {
    if (req.file) {
        try {
            const { buffer, originalname, mimetype } = req.file;
            let name = originalname.split(" ").join("_");
            const extension = MIME_TYPES[mimetype];
            const newFilename = name + Date.now() + "." + extension;
            let optimizedBuffer = await sharp(buffer)
                .resize(463, 595)
                .webp({quality: 80})
                .toBuffer();
            await sharp(optimizedBuffer).toFile(
                path.resolve(__dirname, "./images", newFilename)
            );
            req.file.filename = newFilename;
            next();
        } catch {
            console.error("Erreur lors de l'optimisation de l'image", error);
            next(error);
        }
    } else {
        next(newError("Aucun fichier fourni"));
    }
};

module.exports = { upload, resizeImage };