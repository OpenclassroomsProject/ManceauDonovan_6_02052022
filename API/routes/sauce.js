const express = require('express');
const router = express.Router();
var multer = require('../middleware/multer-config');


const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');

const detectObj = require('../middleware/detectObj')

router.get('/', auth, saucesCtrl.getAll);
router.post('/', auth, multer.single('image'),detectObj, saucesCtrl.create);
router.get('/:_id', auth, saucesCtrl.getOne);
router.post('/:_id/like', auth, detectObj, saucesCtrl.like);
router.delete('/:_id', auth, saucesCtrl.delete);
router.put('/:_id', auth,multer.single('image'),detectObj, saucesCtrl.modify)





module.exports = router;