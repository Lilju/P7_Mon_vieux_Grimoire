const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { upload, resizeImage } = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book');

router.post('/', auth, upload, resizeImage, bookCtrl.createBook);

router.post('/:id/rating', bookCtrl.createRating);
  
router.get('/:id', bookCtrl.getOneBook);
  
router.get('/', bookCtrl.getAllBooks);

router.get('/bestrating', bookCtrl.getBestRating);
  
router.put('/:id', auth, upload, resizeImage, bookCtrl.modifyBook);
  
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;