const express = require('express')
const router = express.Router();

const controller = require('../controllers/feedback.controller')
 

// POST: send feedback
router.post('/sendFeedback', controller.sendFeedback)

module.exports = router