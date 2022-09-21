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
route.post('/admin/sign-up',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,login_ct.signup);

//signin
route.post('/admin/sign_in',login_ct.signin);

//***************************************************************************** */
// User and Admin
//***************************************************************************** */
// user overview
route.get('/admin/userOverview',auth.requiredToken,user_ct.userOverview)

// add new member (user)
route.post('/admin/addNewMember',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,user_ct.addNewMember)

// get all admin list
route.post('/admin/adminList',auth.requiredToken,user_ct.getAllAdminList);

//get admin detail
route.get('/admin/adminDetail/:id',auth.requiredToken,user_ct.getAdminDetail)

//update Admin Detail
route.put('/admin/updateAdminDetail',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,user_ct.updateAdminDetail)

// delete admin
route.delete('/admin/deleteAdmin/:id',auth.requiredToken,user_ct.deleteAdmin);

// get user length
route.get('/admin/userLength',auth.requiredToken,user_ct.getUsersLength)

// get all users
route.post('/admin/usersList',auth.requiredToken,user_ct.getAlluserList)

// get all users
route.get('/admin/usersListForInsert',auth.requiredToken,user_ct.getAllUserForPropertySelect)

// get users Id
route.get('/admin/userByid/:id',auth.requiredToken,user_ct.getUserById)

// delete user
route.delete('/admin/deleteUserById/:id',auth.requiredToken,user_ct.deleteUser)

//delete favorite property id
route.delete('/admin/deleteFavPropsById/:id',auth.requiredToken,user_ct.deleteFavProperty)

//delete compare property id
route.delete('/admin/deleteComparePropsById/:id',auth.requiredToken,user_ct.deleteCompareProperty)

// update User
route.put('/admin/updateUser',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesAvatar,multer_s.getResult,user_ct.updateUser)

//get new user lengt
route.get('/admin/getNewUserLength',auth.requiredToken,user_ct.getNewUserLength)

//get addmin length
route.get('/admin/getAdminLength',auth.requiredToken,user_ct.getAdminLength)

//seach user
route.post('/admin/seachUser',auth.requiredToken,user_ct.seachUser)

//seach user dialog
route.post('/admin/seachUserDialog',auth.requiredToken,user_ct.seachUserDialog)

//seach admin
route.post('/admin/seachAdmin',auth.requiredToken,user_ct.seachAdmin)

//change Status User
route.get('/admin/changeStatusUser/:id',auth.requiredToken,user_ct.changeStatusUser)

//***************************************************************************** */
// Property Data
//***************************************************************************** */
//property Overview
route.get('/admin/propertyOverview',auth.requiredToken,property_ct.propertyOverview)

//add new Property
route.post('/admin/addNewProperty',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesProperty,multer_s.getResult,property_ct.addNewProperty);

// get property length
route.get('/admin/propertyLength',auth.requiredToken,property_ct.getPropertyLength);

// get all property list
route.post('/admin/property-list',auth.requiredToken,property_ct.getAllPropertyList);

//get property List By user ID
route.get('/admin/getPropertyListByUserId/:id',auth.requiredToken,property_ct.getPropertyListByUserId)

//delete property by id
route.delete('/admin/deletePropertyById/:id',auth.requiredToken,property_ct.deletePropertyById)

//get Favorite Property
route.get('/admin/getFavoriteProperty/:id',auth.requiredToken,property_ct.getFavoriteProperty)

//get Compare property
route.get('/admin/getCompareProperty/:id',auth.requiredToken,property_ct.getCompareProperty)

//get property By ID
route.get('/admin/propertyBy/:id',auth.requiredToken,property_ct.getPropertyByID);

//delete Property Image
route.delete('/admin/deletePropertyImage/:id',auth.requiredToken,property_ct.deletePropertyImage);

//get image by property id
route.get('/admin/getImagesByPropID/:id',auth.requiredToken,property_ct.getImagesByPropID)

//update property
route.put('/admin/updatePropertyDetail',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesProperty,multer_s.getResult,property_ct.updateProperty);

// get property type
route.get('/admin/property_type',auth.requiredToken,property_ct.getAllPropertyType)

//get property porpose
route.get('/admin/property_purposes',auth.requiredToken,property_ct.getAllPropertyPurposes)

//get Futures list
route.get('/admin/futuresList',auth.requiredToken,property_ct.getAllFutures)

//get new property leength
route.get('/admin/getNewPropertyLength',auth.requiredToken,property_ct.getNewPropertyLength)

//seach property table
route.post('/admin/searchProperty',auth.requiredToken,property_ct.searchProperty)

//***************************************************************************** */
// report
//***************************************************************************** */
//user report
route.post('/admin/userReport',auth.requiredToken,report_ct.userReport)

//reporter list
route.get('/admin/userReporterList/:id',auth.requiredToken,report_ct.userReporter)

//confirm user report
route.delete('/admin/confirmUserReport/:id',auth.requiredToken,report_ct.confirmUserReport)

//add property New Report Topic
route.post('/admin/addPropertyReportTopic',auth.requiredToken,report_ct.addPropertyReportTopic)

// update property report topic
route.put('/admin/updatePropertyReportTopic',auth.requiredToken,report_ct.updatePropertyReportTopic)

// delete Property Report Topic
route.delete('/admin/deletePropertyReportTopic/:id',auth.requiredToken,report_ct.deletePropertyReportTopic)

//get all property report topic
route.get('/admin/getAllPropertyReportTopic',auth.requiredToken,report_ct.getAllPropertyReportTopic)

//add user New Report Topic
route.post('/admin/addNewReportTopic',auth.requiredToken,report_ct.addNewReportTopic)

//update report tpoic
route.put('/admin/updateReportTopic',auth.requiredToken,report_ct.updateReportTopic)

//get all report topic
route.get('/admin/getAllReportTopic',auth.requiredToken,report_ct.getAllReportTopic)

//delete report topic
route.delete('/admin/deleteReportTopic/:id',auth.requiredToken,report_ct.deleteReportTopic)

//get all property report
route.post('/admin/getAllPropertyReport',auth.requiredToken,report_ct.getAllPropertyReport)

//confirm Property Report
route.delete('/admin/confirmPropertyReport/:id',auth.requiredToken,report_ct.confirmPropertyReport)

//get reporter list
route.get('/admin/getReporterList/:id',auth.requiredToken,report_ct.getReporterList)

//get property report length
route.get('/admin/propertyReportLength',auth.requiredToken,report_ct.propertyReportLength)

//get user report length
route.get('/admin/userReportLength',auth.requiredToken,report_ct.userReportLength)

//***************************************************************************** */
// FAQ
//***************************************************************************** */
//get FAQ
route.get('/admin/getFAQ',auth.requiredToken,faq_ct.getFAQ)

//get FAQ Category
route.get('/admin/getCategoryFAQ',auth.requiredToken,faq_ct.getCategoryFAQ)

//get FAQ by Category ID
route.get('/admin/getFAQByCategory/:id',auth.requiredToken,faq_ct.getFAQByCategory)

//get FAQ By ID
route.get('/admin/getFAQ_byID/:id',auth.requiredToken,faq_ct.getFAQByID)

//insert FAQ
route.post('/admin/insertFAQ',auth.requiredToken,faq_ct.insertFAQ)

//update FAQ
route.put('/admin/updateFAQ',auth.requiredToken,faq_ct.updateFAQ)

//delete FAQ
route.delete('/admin/deleteFAQ/:id',auth.requiredToken,faq_ct.deleteFAQ)

//change Status FAQ
route.get('/admin/changeStatusFAQ/:id',auth.requiredToken,faq_ct.changeStatusFAQ)

//***************************************************************************** */
// address
//***************************************************************************** */
// get all provices
route.get('/admin/provinces',other_ct.getProvinces);

// get all districts
route.get('/admin/districts',other_ct.getDistricts)

// get all sub-districts
route.get('/admin/subDistrict',other_ct.getSubDistricts)

// get districts By Province Id
route.get('/admin/districts/:id',other_ct.getDistrictsByID);

// get sub-districts By districts Id
route.get('/admin/subDistricts/:id',other_ct.getSubDistrictsByDtID);

// get zipcode By districts Id
route.get('/admin/subDistricts/zipcode/:id',other_ct.getZipCode);

//***************************************************************************** */
//package
//***************************************************************************** */
// package overview 
route.get('/admin/packageOverview',auth.requiredToken,package_ct.packageOverview)
//get all package
route.get('/admin/package',auth.requiredToken,package_ct.getPackageName)

//insert package
route.post('/admin/insert_package',auth.requiredToken,package_ct.insertPackage)

//delete package
route.delete('/admin/delete_package/:id',auth.requiredToken,package_ct.deletePackage)

//update package
route.put('/admin/packageUpdate',auth.requiredToken,package_ct.updatePackage)



//***************************************************************************** */
// Money Transfer
//***************************************************************************** */
// income Chart
route.get('/admin/inComeChart',auth.requiredToken,moneyTransfer_ct.inComeChartData)

//money Transfer Overview
route.get('/admin/moneyTransferOverview',auth.requiredToken,moneyTransfer_ct.moneyTransferOverview)

//money transfer
route.post('/admin/addMoneyTransfer',auth.requiredToken,multer_s.uploadImages,multer_s.resizeImagesPayment,multer_s.getResult,moneyTransfer_ct.addMoneyTransfer)

//get All Money Transfer
route.post('/admin/getAllMoneyTransfer',auth.requiredToken,moneyTransfer_ct.getAllMoneyTransfer)

//get Money Transfer By User Id
route.get('/admin/getMoneyTransferByUserId/:id',auth.requiredToken,moneyTransfer_ct.getMoneyTransferByUserId)

//get new money transfer
route.get('/admin/getNewMoneyTransfer',auth.requiredToken,moneyTransfer_ct.getNewMoneyTransfer)

//confirm Money Transfer
route.put('/admin/confirmMoneyTransfer',auth.requiredToken,moneyTransfer_ct.confirmMoneyTransfer)

//delete money ransfer
route.delete('/admin/deleteMoneyTransfer/:id',auth.requiredToken,moneyTransfer_ct.deleteMoneyTransfer)

//seachMoneyTransfer
route.post('/admin/seachMoneyTransfer',auth.requiredToken,moneyTransfer_ct.seachMoneyTransfer)

//***************************************************************************** */
//our service
//***************************************************************************** */
// get all our services
route.get('/admin/getAllOurServices',auth.requiredToken,other_ct.getAllOurServices)

// add new our service
route.post('/admin/addNewOurService',auth.requiredToken,other_ct.addNewOurService)

// delete our service
route.delete('/admin/deleteOurService/:id',auth.requiredToken,other_ct.deleteOurService)

// update our service
route.put('/admin/updateOurService',auth.requiredToken,other_ct.updateOurService)

//***************************************************************************** */
// user req
//***************************************************************************** */
// get user req by user
route.get('/admin/getUserReq/:id',auth.requiredToken,other_ct.getUserReq)

// delete user req by req id
route.delete('/admin/deleteUserReq/:id',auth.requiredToken,other_ct.deleteUserReq)

//***************************************************************************** */
//Feature
//***************************************************************************** */
//insert features
route.post('/admin/insert_features',auth.requiredToken,other_ct.insertFeatures)

//delete features
route.delete('/admin/delete_features/:id',auth.requiredToken,other_ct.deleteFeatures)


//***************************************************************************** */
// auth
//***************************************************************************** */
// Verify Token
route.post('/admin/verifyToken',auth.requiredToken,auth.checkToken)

//***************************************************************************** */
// Line test
//***************************************************************************** */
route.get('/admin/lineN',other_ct.lineNotify)

//***************************************************************************** */
// contact
//***************************************************************************** */
//get all contact us 
route.get('/admin/getAllContactUs',auth.requiredToken,other_ct.getAllContactUs)

//delete contact us 
route.delete('/admin/deleteContactUs/:id',auth.requiredToken,other_ct.deleteContactUs)

//reply contact us 
route.put('/admin/replyContactUs',auth.requiredToken,other_ct.replyContactUs)

//search contact 
route.post('/admin/searchContactUs',auth.requiredToken,other_ct.searchContactUs)

//***************************************************************************** */
// about us
//***************************************************************************** */
//get about us
route.get('/admin/getAboutUs',auth.requiredToken,other_ct.getAboutUs)

//update about us
route.put('/admin/updateAboutUs',auth.requiredToken,other_ct.updateAboutUs)


module.exports = route ;
