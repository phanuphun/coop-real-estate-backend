const express = require('express')
const router = express.Router();

const controller = require('../controllers/address.controller')
 

//get province to address selector
router.get('/getProvinces', controller.getProvinces)

//get district to address selector (depend on province)
router.get('/getDistricts/:id', controller.getDistricts)

//get sub-district to address selector (depend on district)
router.get('/getSubDistricts/:id', controller.getSubDistricts)

router.get('/getGeo', controller.getGeo)

router.get('/getProvincesss/:provinceId/:districtId/:subDistrictId', controller.getProvincesss)

router.get(`/getProvinceLatLng/:id`, controller.getProvinceLatLng)
// router.get('/testPage/:page/:perPage', controller.testPage)

// router.put('/setProvinceLatLng', controller.setProvinceLatLng)

// router.post('/bulkInsertLatLng', controller.bulkInsertLatLng)
module.exports = router