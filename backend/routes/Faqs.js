const express = require('express')
const router = express.Router();

const controller = require('../controllers/faqs.controller')
const validator = require('../services/validator/validator')
 
router.get('/getFaqs', controller.getFaqs)

router.post('/setReview/:faqId', validator.verify, controller.setFaqHelful)

module.exports = router