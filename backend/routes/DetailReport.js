const express = require('express')
const router = express.Router();

const controller = require('../controllers/detailReport.controller')
 
router.get('/getDetailReportUser', controller.getDetailReportUser)

router.get('/getDetailReportProperty', controller.getDetailReportProperty)


module.exports = router