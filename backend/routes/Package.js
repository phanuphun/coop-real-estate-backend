const express = require('express')
const router = express.Router();

const controller = require('../controllers/package.controller')
const validator = require('../services/validator/validator')
 
router.get('/getPackages1M', controller.getPackages1M)

router.get('/getPackages3M', controller.getPackages3M)

router.get('/getPackages6M', controller.getPackages6M)


module.exports = router