const express = require('express')
const router = express.Router();

const controller = require('../controllers/address.controller')
 

//get province to address selector
router.get('/getProvinces/:lang', controller.getProvinces)

//get district to address selector (depend on province)
router.get('/getDistricts/:id/:lang', controller.getDistricts)

//get sub-district to address selector (depend on district)
router.get('/getSubDistricts/:id/:lang', controller.getSubDistricts)

// router.get('/getGeo', controller.getGeo)

// router.get(`/getProvinceLatLng/:id`, controller.getProvinceLatLng)

module.exports = router