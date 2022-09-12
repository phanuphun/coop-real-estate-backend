const express = require('express');
const route = express.Router()

//import controller
const login_ct = require('./controller/login_controller')
const user_ct = require('./controller/user_controller')
const property_ct = require('./controller/property_controller')
const faq_ct = require('./controller/faq_controller')
const other_ct = require('./controller/other_controller')
const package_ct = require('./controller/package_controller')
const report_ct = require('./controller/report_controller')
const moneyTransfer_ct = require('./controller/moneyTransfer_controller')

//service
const auth = require('./../service/auth_service')
const multer_s = require('./../service/multer')



//***************************************************************************** */
//Login
//***************************************************************************** */
//signup
route.post('/sign-up',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,login_ct.signup);

//signin
route.post('/sign_in',login_ct.signin);

//***************************************************************************** */
// User and Admin
//***************************************************************************** */
// user overview
route.get('/userOverview',auth.requiredToken,user_ct.userOverview)

// add new member (user)
route.post('/addNewMember',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,user_ct.addNewMember)

// get all admin list
route.post('/adminList',auth.requiredToken,user_ct.getAllAdminList);

//get admin detail
route.get('/adminDetail/:id',auth.requiredToken,user_ct.getAdminDetail)

//update Admin Detail
route.put('/updateAdminDetail',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,user_ct.updateAdminDetail)

// delete admin
route.delete('/deleteAdmin/:id',auth.requiredToken,user_ct.deleteAdmin);

// get user length
route.get('/userLength',auth.requiredToken,user_ct.getUsersLength)

// get all users
route.post('/usersList',auth.requiredToken,user_ct.getAlluserList)

// get all users
route.get('/usersListForInsert',auth.requiredToken,user_ct.getAllUserForPropertySelect)

// get users Id
route.get('/userByid/:id',auth.requiredToken,user_ct.getUserById)

// delete user
route.delete('/deleteUserById/:id',auth.requiredToken,user_ct.deleteUser)

//delete favorite property id
route.delete('/deleteFavPropsById/:id',auth.requiredToken,user_ct.deleteFavProperty)

//delete compare property id
route.delete('/deleteComparePropsById/:id',auth.requiredToken,user_ct.deleteCompareProperty)

// update User
route.put('/updateUser',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,user_ct.updateUser)

//get new user lengt
route.get('/getNewUserLength',auth.requiredToken,user_ct.getNewUserLength)

//get addmin length
route.get('/getAdminLength',auth.requiredToken,user_ct.getAdminLength)

//seach user
route.post('/seachUser',auth.requiredToken,user_ct.seachUser)

//seach user dialog
route.post('/seachUserDialog',auth.requiredToken,user_ct.seachUserDialog)

//seach admin
route.post('/seachAdmin',auth.requiredToken,user_ct.seachAdmin)

//***************************************************************************** */
// Property Data
//***************************************************************************** */
// porperty overview
route.get('/porpertyDataOverView',auth.requiredToken,property_ct.porpertyDataOverView)

//add new Property
route.post('/addNewProperty',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesProperty,multer_s.getResult,property_ct.addNewProperty);

// get property length
route.get('/propertyLength',auth.requiredToken,property_ct.getPropertyLength);

// get all property list
route.post('/realEstate/property-list',auth.requiredToken,property_ct.getAllPropertyList);

//get property List By user ID
route.get('/getPropertyListByUserId/:id',auth.requiredToken,property_ct.getPropertyListByUserId)

//delete property by id
route.delete('/deletePropertyById/:id',auth.requiredToken,property_ct.deletePropertyById)

//get Favorite Property
route.get('/getFavoriteProperty/:id',auth.requiredToken,property_ct.getFavoriteProperty)

//get Compare property
route.get('/getCompareProperty/:id',auth.requiredToken,property_ct.getCompareProperty)

//get property By ID
route.get('/realEstate/propertyBy/:id',auth.requiredToken,property_ct.getPropertyByID);

//delete Property Image
route.delete('/deletePropertyImage/:id',auth.requiredToken,property_ct.deletePropertyImage);

//get image by property id
route.get('/getImagesByPropID/:id',auth.requiredToken,property_ct.getImagesByPropID)

//update property
route.put('/updatePropertyDetail',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesProperty,multer_s.getResult,property_ct.updateProperty);

// get property type
route.get('/property_type',auth.requiredToken,property_ct.getAllPropertyType)

//get property porpose
route.get('/property_purposes',auth.requiredToken,property_ct.getAllPropertyPurposes)

//get Futures list
route.get('/futuresList',auth.requiredToken,property_ct.getAllFutures)

//get new property leength
route.get('/getNewPropertyLength',auth.requiredToken,property_ct.getNewPropertyLength)

//seach property table
route.post('/searchProperty',auth.requiredToken,property_ct.searchProperty)

//***************************************************************************** */
// report
//***************************************************************************** */
//user report
route.post('/userReport',auth.requiredToken,report_ct.userReport)

//reporter list
route.get('/userReporterList/:id',auth.requiredToken,report_ct.userReporter)

//confirm user report
route.delete('/confirmUserReport/:id',auth.requiredToken,report_ct.confirmUserReport)

//add property New Report Topic
route.post('/addPropertyReportTopic',auth.requiredToken,report_ct.addPropertyReportTopic)

// update property report topic
route.put('/updatePropertyReportTopic',auth.requiredToken,report_ct.updatePropertyReportTopic)

// delete Property Report Topic
route.delete('/deletePropertyReportTopic/:id',auth.requiredToken,report_ct.deletePropertyReportTopic)

//get all property report topic
route.get('/getAllPropertyReportTopic',auth.requiredToken,report_ct.getAllPropertyReportTopic)

//add user New Report Topic
route.post('/addNewReportTopic',auth.requiredToken,report_ct.addNewReportTopic)

//update report tpoic
route.put('/updateReportTopic',auth.requiredToken,report_ct.updateReportTopic)

//get all report topic
route.get('/getAllReportTopic',auth.requiredToken,report_ct.getAllReportTopic)

//delete report topic
route.delete('/deleteReportTopic/:id',auth.requiredToken,report_ct.deleteReportTopic)

//get all property report
route.post('/getAllPropertyReport',auth.requiredToken,report_ct.getAllPropertyReport)

//confirm Property Report
route.delete('/confirmPropertyReport/:id',auth.requiredToken,report_ct.confirmPropertyReport)

//get reporter list
route.get('/getReporterList/:id',auth.requiredToken,report_ct.getReporterList)

//get property report length
route.get('/propertyReportLength',auth.requiredToken,report_ct.propertyReportLength)

//get user report length
route.get('/userReportLength',auth.requiredToken,report_ct.userReportLength)

//***************************************************************************** */
// FAQ
//***************************************************************************** */
//get FAQ
route.get('/getFAQ',auth.requiredToken,faq_ct.getFAQ)

//get FAQ Category
route.get('/getCategoryFAQ',auth.requiredToken,faq_ct.getCategoryFAQ)

//get FAQ by Category ID
route.get('/getFAQByCategory/:id',auth.requiredToken,faq_ct.getFAQByCategory)

//get FAQ By ID
route.get('/getFAQ_byID/:id',auth.requiredToken,faq_ct.getFAQByID)

//insert FAQ
route.post('/insertFAQ',auth.requiredToken,faq_ct.insertFAQ)

//update FAQ
route.put('/updateFAQ',auth.requiredToken,faq_ct.updateFAQ)

//delete FAQ
route.delete('/deleteFAQ/:id',auth.requiredToken,faq_ct.deleteFAQ)

//change Status FAQ
route.get('/changeStatusFAQ/:id',auth.requiredToken,faq_ct.changeStatusFAQ)

//***************************************************************************** */
// address
//***************************************************************************** */
// get all provices
route.get('/provinces',other_ct.getProvinces);

// get all districts
route.get('/districts',other_ct.getDistricts)

// get all sub-districts
route.get('/subDistrict',other_ct.getSubDistricts)

// get districts By Province Id
route.get('/districts/:id',other_ct.getDistrictsByID);

// get sub-districts By districts Id
route.get('/subDistricts/:id',other_ct.getSubDistrictsByDtID);

// get zipcode By districts Id
route.get('/subDistricts/zipcode/:id',other_ct.getZipCode);

//***************************************************************************** */
//package
//***************************************************************************** */
//get all package
route.get('/package',auth.requiredToken,package_ct.getPackageName)

//insert package
route.post('/insert_package',auth.requiredToken,package_ct.insertPackage)

//delete package
route.delete('/delete_package/:id',auth.requiredToken,package_ct.deletePackage)

//update package
route.put('/packageUpdate',auth.requiredToken,package_ct.updatePackage)



//***************************************************************************** */
// Money Transfer
//***************************************************************************** */
//money Transfer Overview
route.get('/moneyTransferOverview',auth.requiredToken,moneyTransfer_ct.moneyTransferOverview)

//money transfer
route.post('/addMoneyTransfer',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesPayment,multer_s.getResult,moneyTransfer_ct.addMoneyTransfer)

//get All Money Transfer
route.post('/getAllMoneyTransfer',auth.requiredToken,moneyTransfer_ct.getAllMoneyTransfer)

//get Money Transfer By User Id
route.get('/getMoneyTransferByUserId/:id',auth.requiredToken,moneyTransfer_ct.getMoneyTransferByUserId)

//get new money transfer
route.get('/getNewMoneyTransfer',auth.requiredToken,moneyTransfer_ct.getNewMoneyTransfer)

//confirm Money Transfer
route.put('/confirmMoneyTransfer',auth.requiredToken,moneyTransfer_ct.confirmMoneyTransfer)

//delete money ransfer
route.delete('/deleteMoneyTransfer/:id',auth.requiredToken,moneyTransfer_ct.deleteMoneyTransfer)

//seachMoneyTransfer
route.post('/seachMoneyTransfer',auth.requiredToken,moneyTransfer_ct.seachMoneyTransfer)

//***************************************************************************** */
// user req
//***************************************************************************** */
// get user req by user
route.get('/getUserReq/:id',auth.requiredToken,other_ct.getUserReq)

// delete user req by req id
route.delete('/deleteUserReq/:id',auth.requiredToken,other_ct.deleteUserReq)

//***************************************************************************** */
//Feature
//***************************************************************************** */
//insert features
route.post('/insert_features',auth.requiredToken,other_ct.insertFeatures)

//delete features
route.delete('/delete_features/:id',auth.requiredToken,other_ct.deleteFeatures)


//***************************************************************************** */
// auth
//***************************************************************************** */
// Verify Token
route.post('/verifyToken',auth.requiredToken,auth.checkToken)

//***************************************************************************** */
//Line
//***************************************************************************** */
route.get('/lineN',other_ct.lineNotify)
module.exports = route ;
