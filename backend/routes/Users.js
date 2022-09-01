const express = require('express')
const router = express.Router();
const  validator = require('../services/validator/validator') 
const controller = require('../controllers/users.controller')
const multer = require('../services/multer/multer')

router.post('/login', controller.login)

router.post('/val', validator.verify)

router.post('/addToFavorite/:propertyId', validator.verify, controller.addToFavorite)

router.post('/addToCompare/:propertyId', validator.verify, controller.addToCompare)

router.get('/getAgentById/:id', controller.getAgentById)

router.get('/getAgents', controller.getAgents)

router.get('/getUserProfile', validator.verify, controller.getUserProfile)

router.put('/updateUserProfile', validator.verify, controller.updateUserProfile)

router.put('/updateAvatar', validator.verify, multer.uploadImages, multer.resizeImages, multer.getResult, controller.updateAvatar)

router.get('/getAccountBasic', validator.verify, controller.getAccountBasic)

router.get('/checkFavorite/:propertyId', validator.verify, controller.checkFavorite)

router.get('/checkCompare/:propertyId', validator.verify, controller.checkCompare)

router.post('/addRequirement', validator.verify, controller.addRequirement)

router.get('/getRequirements', validator.verify, controller.getRequirements)

router.post('/removeRequirement/:id', validator.verify, controller.removeRequirement)

router.post('/removeRequirement', validator.verify, controller.clearAllRequirement)

router.post('/reportProperty/:propertyId', validator.verify, controller.reportProperty)

router.get('/getUserPackageId', validator.verify, controller.getUserPackageId)

module.exports = router