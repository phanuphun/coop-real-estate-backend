const express = require('express')
const router = express.Router();
const controller = require('../controllers/line.controller')


router.post('/webhook', controller.webhook)

  

module.exports = router