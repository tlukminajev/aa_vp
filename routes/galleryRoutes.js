const express = require('express')
//sisselogimise kontroll
const checkLogin = require('../public/src/checkLogin');

const router = express.Router()
//kontrollin sisselogimist
router.use(checkLogin.isLogin);

const {gallery} = require('../controllers/galleryControllers')

router.route('/').get(gallery)

module.exports = router