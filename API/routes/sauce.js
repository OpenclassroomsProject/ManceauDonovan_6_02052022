const express = require('express');
const router = express.Router();
var multer = require('../middleware/multer-config');


const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');

router.post('/', auth, multer.single('image'), saucesCtrl.create);
router.get('/', auth, saucesCtrl.getAll);
router.get('/:_id', auth, saucesCtrl.getOne);
router.post('/:_id/like', auth, saucesCtrl.like);
router.delete('/:_id', auth, saucesCtrl.delete);
router.put('/:_id', auth, multer.single('image'), saucesCtrl.modify)





module.exports = router;