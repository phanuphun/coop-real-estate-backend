const express = require('express');

const router = express.Router();

const controller = require('../controllers/property.controller')

const multerController = require('../services/multer/multer')


//get property type selector
router.get('/getPropertyType', controller.getPropType)


//get property additional to additional list (depend on property type)
router.get('/getPropertyAdditional', controller.getPropAdditional)

//get property features to features list (depend on property type)
router.get('/getPropertyFeatures', controller.getPropAdditionalFeatures)

//get property purpose 
router.get('/getPropertyPurpose', controller.getPropPurpose)


module.exports = router