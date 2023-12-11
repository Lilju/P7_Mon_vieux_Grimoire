const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.memoryStorage();
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
                path.resolve(__dirname, "../images", newFilename)
            );
            req.file.filename = newFilename;
            next();
        } catch (error) {
            console.error("Erreur lors de l'optimisation de l'image", error);
            next(error);
        }
    } else if (!req.file) {
        return next();
    } else {
        next(new Error("Aucun fichier fourni"));
    }
};

module.exports = { upload, resizeImage };