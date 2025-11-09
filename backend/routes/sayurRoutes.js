const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const sayurController = require('../controllers/sayurController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});

const upload = multer({ storage });

router.get('/', sayurController.getAllSayur);
router.get('/:id', sayurController.getSayurById);
router.post('/', upload.single('gambar'), sayurController.addSayur);
router.put('/:id', upload.single('gambar'), sayurController.updateSayur);
router.delete('/:id', sayurController.deleteSayur);

module.exports = router;
