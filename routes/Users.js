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

router.put('/updateAvatar', validator.verify, multer.uploadImages, multer.resizeImagesAvatar, multer.getResult, controller.updateAvatar)

router.get('/getAccountBasic', validator.verify, controller.getAccountBasic)

router.get('/checkFavorite/:propertyId', validator.verify, controller.checkFavorite)

router.get('/checkCompare/:propertyId', validator.verify, controller.checkCompare)

router.post('/userReportProperty/:propertyId', validator.verify, controller.userReportProperty)

router.get('/getUserPackageId', validator.verify, controller.getUserPackageId)

router.post('/userCreateRequirementPost', validator.verify, controller.userCreateRequirementPost)

router.get('/getUserRequirementPost', validator.verify, controller.getUserRequirementPost)

router.post('/removeRequirementPostById/:postId', validator.verify, controller.removeRequirementPostById)

router.put('/editRequirementPostById/:postId', validator.verify, controller.editRequirementPostById)

router.post('/clearAllRequirementPost', validator.verify, controller.clearAllRequirementPost)

router.get('/getRequirementPostByAgentId/:userId', controller.getRequirementPostByAgentId)

router.get('/checkUserAndAgentSame/:agentId', validator.verify, controller.checkUserAndAgentSame)

router.post('/userReportAgent/:agentId', validator.verify, controller.userReportAgent)

router.post('/userBuyPackage', validator.verify, multer.uploadImages, multer.resizeImagesPayment, multer.getResult, controller.userBuyPackage)

router.get('/getUserPackageExpire', validator.verify, controller.getUserPackageExpire)

router.post('/userCancelPackage' ,validator.verify, controller.userCancelPackage)


module.exports = router