const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const detectObj = require ('../middleware/detectObj')




router.post('/login', detectObj , userCtrl.login);
router.post('/signup', detectObj , userCtrl.signup);

module.exports = router;