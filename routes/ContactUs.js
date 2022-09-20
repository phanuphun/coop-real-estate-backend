const express = require('express')
const router = express.Router();

const controller = require('../controllers/contactUs.controller')
 

// POST: send contact
router.post('/sendContact', controller.createContact)

module.exports = router