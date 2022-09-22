const express = require('express')
const router = express.Router();

const controller = require('../controllers/aboutUs.controller')
 

// get: about us
router.get('/getAboutUs', controller.getAboutUs)

module.exports = router