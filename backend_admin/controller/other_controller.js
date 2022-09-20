const dbConn = require('../database')
const err_service = require('./../../service/err_service')
const lineN = require('line-notify-nodejs')('1ocSpbTTTf6JQIcUcJNDtqqsFfeWFzvbXPXupQhd6JU');
const nodemailer = require('nodemailer');

//***************************************************************************** */
// Address Data
//***************************************************************************** */
// get all provines
module.exports.getProvinces = (req,res) => {
    dbConn.query('SELECT * FROM provinces ORDER BY name_th ASC',(err,result)=>{
        if(err) err_service.errorNotification(err,'get province')
        res.send({
            msg:'get province succcess',
            data: result
        })
    })
}
// get all districts
module.exports.getDistricts = (req,res) => {
    dbConn.query('SELECT * FROM districts ORDER BY name_th ASC',(err,result)=>{
        if(err) err_service.errorNotification(err,'get districts')
        res.send({
            msg:'get Districts succcess',
            data: result
        })
    })
}
// get all subdistricts
module.exports.getSubDistricts = (req,res) => {
    dbConn.query('SELECT * FROM `subdistricts` ORDER BY name_th ASC',(err,result)=>{
        if(err) err_service.errorNotification(err,'get subdistricts')
        res.send({
            msg:'get Districts subdistricts',
            data: result
        })
    })
}
// get districts By Province Id
module.exports.getDistrictsByID = (req,res) => {
    privinceID = req.params.id
    dbConn.query('SELECT * FROM districts WHERE ProvinceId = ? ORDER BY name_th ASC;',[privinceID],(err,result)=>{
        if(err) err_service.errorNotification(err,'get districts by province id')
        res.send({
            msg:'get districts By ProvinceID succcess',
            data: result
        })
    })
}
// get subdistricts' By districts id
module.exports.getSubDistrictsByDtID = (req,res) => {
    districts_id = req.params.id
    dbConn.query('SELECT * FROM `subdistricts` WHERE DistrictId  = ? ORDER BY name_th ASC',[districts_id],(err,result)=>{
        if(err) err_service.errorNotification(err,'subdistricts by districts id')
        res.send({
            msg:'get subdistricts By districts ID succcess',
            data: result
        })
    })
}
// get zip code
module.exports.getZipCode = (req,res) => {
    subD_id = req.params.id
    console.log(subD_id);
    dbConn.query('SELECT * FROM `subdistricts` WHERE id  = ? ORDER BY name_th ASC',[subD_id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get zip-code by sub-district id')
        res.send({
            msg:'get zipCode By ID succcess',
            data: result
        })
    })
}

//***************************************************************************** */
// user requirements
//***************************************************************************** */
// get user require ment by user id
module.exports.getUserReq = (req,res) => {
    sql = `
    SELECT
        user_requirements.id AS userReqId,
        users.id AS userId,
        users.fname AS userFname,
        users.lname AS userLname,
        property_types.name_th AS propertyType,
        property_purposes.name_th AS propertyPurpose,
        subdistricts.name_th AS subDistrict,
        districts.name_th AS districts,
        provinces.name_th AS province
    FROM user_requirements
    INNER JOIN users ON users.id = user_requirements.userId
    INNER JOIN property_types ON property_types.id = user_requirements.typeId
    INNER JOIN property_purposes ON property_purposes.id = user_requirements.purposeId
    INNER JOIN subdistricts ON subdistricts.id = user_requirements.subDistrictId
    INNER JOIN districts ON districts.id = subdistricts.DistrictId
    INNER JOIN provinces ON provinces.id = districts.ProvinceId
    WHERE user_requirements.userId = ${req.params.id}
    ORDER BY user_requirements.id DESC ;
    `
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get user req')
        res.send({
            status:true,
            data:result
        })
    })
}
// delete user req by req id
module.exports.deleteUserReq = (req,res) => {
    sql =`
        DELETE FROM user_requirements
        WHERE id = ${req.params.id};
    `
    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'delete user requirement by req id ')
        res.send({
            status:true,
            msg:'ลบความต้องการของผู้ใช้เรียบร้อย'
        })
    })
}

//***************************************************************************** */
// Feature
//***************************************************************************** */
//insert features
module.exports.insertFeatures = (req,res) => {
    featuresName = req.body.featuresName
    dbConn.query('SELECT * FROM property_additional_features WHERE name_th = ?',[featuresName],(err,result)=>{
        if(err) err_service.errorNotification(err,'add new features => check features name')
        if(result.length >= 1){
            res.send({
                status:false,
                msg:'ชื่อนี้มีอยู่แล้ว'
            })
        }else if(featuresName === ' ' || featuresName === null || featuresName === ' ') {
            res.send({
                status:false,
                msg:'ชื่อไม่ถูกต้อง'
            })
        }else{
            dbConn.query('INSERT INTO property_additional_features(name_th) VALUES(?)',[featuresName],(err,result)=>{
                if(err) err_service.errorNotification(err,'add new package => insert new feature')
                res.send({
                    status:true,
                    msg:'เพิ่มข้อมูลสำเร็จ'
                })
            })
        }
    })
}
//delete features
module.exports.deleteFeatures = (req,res) => {
let id = req.params.id
sql_delete_fetures = 'DELETE FROM property_additional_features WHERE id = ?'
dbConn.query(sql_delete_fetures,[id],(err,result)=>{
    if(err) err_service.errorNotification(err,'delete feature')
    res.send({
        status:true,
        msg:'ลบเรียบร้อย'
    })
})
}

//***************************************************************************** */
// Line
//***************************************************************************** */
//line notify
module.exports.lineNotify = (data) => {
    // console.log(data);

    let date = new Date(data[0].dateTransfer)
    let dateThai = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

    let period

    console.log('=>',data[0].periodId);

    if(data[0].periodId === 1){
        period = '1 เดือน'
    }else if(data[0].periodId === 2){
        period = '3 เดือน'
    }else if(data[0].periodId === 3){
        period = '6 เดือน'
    }

    msg = `
มีการแจ้งโอนเงินเข้ามา
โดยคุณ : ${data[0].userFname} ${data[0].userLname}
สมัครแพ็คเกจ : ${data[0].packageName}
รูปแบบ : ${period}
ราคา : ${data[0].price}
วันที่ : ${dateThai}
            `

        lineN.notify({
            message: msg,
        }).then(() => {
            console.log('send completed!');
        });

}

//***************************************************************************** */
// contact
//***************************************************************************** */
module.exports.mailSend = () => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'parnuphun5555@gmail.com',
               pass: 'eckyyvnxbaywprmg'
           }
       });
       const mailOptions = {
         from: 'parnuphun5555@email.com', // sender address
         to: 'parnuphun1598@gmail.com', // list of receivers
         subject: 'test your fucking contact', // Subject line
         html: '<p>ทดสอบ nodemailer <3 </p>'// plain text body
       };
       transporter.sendMail(mailOptions, function (err, info) {
          if(err)
            console.log(err)
          else
            res.send({
                msg:'its work  !'
            })
            console.log('its work  !');
       });
}

//***************************************************************************** */
// our_sevice
//***************************************************************************** */
// get all our service
module.exports.getAllOurServices = (req,res) => {
    sql =`
        SELECT 
            * 
        FROM our_services 
    `

    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'get all our services ')
        res.send({
            status:true,
            data:result
        })
    })
}
// add new our service
module.exports.addNewOurService = (req,res) => {
    console.log('=>',req.body);
    sqlInsert =`
        INSERT INTO our_services(
                    title,
                    icon,
                    detail)
                VALUES(
                    '${req.body.title}',
                    '${req.body.icon}',
                    '${req.body.detail}'
                )
    `

    dbConn.query(sqlInsert,(err,result)=>{
        if(err)err_service.errorNotification(err,'add new our service')
        res.send({
            status:true,
            msg: ' add new our services success !'
        })
    })
}
// delete new our service
module.exports.deleteOurService = (req,res) => {
    sqlDelete =`
        DELETE FROM our_services WHERE id = ${req.params.id}
    `
    dbConn.query(sqlDelete,(err,result)=>{
        if(err)err_service.errorNotification(err,'delete our service')
        res.send({
            status:true,
            msg:'ลบบริการเรียบร้อยแล้ว'
        })
    })
}
// update pur service
module.exports.updateOurService = (req,res) => {
    sqlUpdate = `
        UPDATE our_services 
        SET title = '${req.body.title}',
            icon = '${req.body.icon}',
            detail = '${req.body.detail}'
        WHERE id = ${req.body.id}
    `
    dbConn.query(sqlUpdate,(err,result)=>{
        if(err)err_service.errorNotification(err,'update our service')
        res.send({
            status:true,
            msg:'บันทึกเรียบร้อยแล้ว'
        })
    })
}