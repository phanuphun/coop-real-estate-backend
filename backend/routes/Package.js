const express = require('express')
const router = express.Router();

const controller = require('../controllers/package.controller')
const validator = require('../services/validator/validator')
 
router.get('/getPackagesMonthly', controller.getPackagesMonthly)

router.get('/getPackagesYearly', controller.getPackagesYearly)

// router.post('/setReview/:faqId', validator.verify, controller.setFaqHelful)

module.exports = router