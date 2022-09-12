const express = require('express')
const router = express.Router();

const controller = require('../controllers/ourServices.controller')
const validator = require('../services/validator/validator')
 
router.get('/getOurServices', controller.getOurServices)


// router.post('/setReview/:faqId', validator.verify, controller.setFaqHelful)

module.exports = router