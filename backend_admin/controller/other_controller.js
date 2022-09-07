const { result } = require('lodash')
let dbConn = require('../database')
let err_service = require('./../service/err_service')
let line_ct = require('./line_controller')

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
// get all sub_districts
module.exports.getSubDistricts = (req,res) => {
    dbConn.query('SELECT * FROM `sub_districts` ORDER BY name_th ASC',(err,result)=>{
        if(err) err_service.errorNotification(err,'get sub_districts')
        res.send({
            msg:'get Districts sub_districts',
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
// get sub_districts' By districts id
module.exports.getSubDistrictsByDtID = (req,res) => {
    districts_id = req.params.id
    dbConn.query('SELECT * FROM `sub_districts` WHERE DistrictId  = ? ORDER BY name_th ASC',[districts_id],(err,result)=>{
        if(err) err_service.errorNotification(err,'sub_districts by districts id')
        res.send({
            msg:'get sub_districts By districts ID succcess',
            data: result
        })
    })
}
// get zip code
module.exports.getZipCode = (req,res) => {
    subD_id = req.params.id
    console.log(subD_id);
    dbConn.query('SELECT * FROM `sub_districts` WHERE id  = ? ORDER BY name_th ASC',[subD_id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get zip-code by sub-district id')
        res.send({
            msg:'get zipCode By ID succcess',
            data: result
        })
    })
}

//***************************************************************************** */
// FAQ
//***************************************************************************** */
//get FAQ
module.exports.getFAQ = (req,res) => {
    sql = `
    SELECT
        faq.* ,
        faq_category.faqCategoryName
    FROM faq
    INNER JOIN faq_category ON faq_category.faqCategoryId = faq.category
    ORDER BY faq.category ASC;`

    sqlHelpful = `
    SELECT
        COUNT(CASE WHEN helpful = 1 THEN 1 ELSE NULL END) AS goodHelp,
        COUNT(CASE WHEN helpful = 0 THEN 1 ELSE NULL END) AS badHelp
    FROM faqhelpfuls WHERE faqId = ?;`

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get FAQ')
        data = result

        for(let i = 0 ; i < data.length ; i++){
            dbConn.query(sqlHelpful,[data[i].faqId],(err,result)=>{
                data[i].goodHelp = result[0].goodHelp
                data[i].badHelp = result[0].badHelp
                console.log(result);
                if((i+1) === data.length){
                    console.log(data);
                    res.send({
                        status:true,
                        msg:'get FAQ success',
                        data:data
                    })
                }
            })
        }
    })
}
//get FAQ By Category ID
module.exports.getFAQByCategory = (req,res) => {
    dbConn.query('SELEcT * FROM faq WHERE category = ? ',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get FAQ By Category ID')
        res.send({
            status:true,
            msg:'get FAQ By Category ID success',
            data:result
        })
    })
}
//get FAQ Category
module.exports.getCategoryFAQ = (req,res) => {
    dbConn.query('SELECT * FROM faq_category',(err,result)=>{
        if(err) err_service.errorNotification(err,'get Category FAQ')
        res.send({
            status:true,
            msg:'get FAQ Category Success ',
            data:result
        })
    })
}
//get FAQ BY ID
module.exports.getFAQByID = (req,res) => {
    dbConn.query('SELEcT * FROM faq WHERE faqId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get FAQ by id')
        res.send({
            data:result,
            msg:'get FAQ By ID success',
            status:true
        })
    })
}
//insert new FAQ
module.exports.insertFAQ = (req,res) => {
    dbConn.query('INSERT INTO faq(faqQ,faqA,category) VALUES(?,?,?)',[req.body.faq_Q,req.body.faq_A,req.body.faq_category],(err,result)=>{
        if(err) err_service.errorNotification(err,'insertFAQ')
        res.send({
            status:true,
            msg:'เพิ่มสำเร็จ'
        })
    })
}
//update FAQ
module.exports.updateFAQ = (req,res) => {
    dbConn.query('UPDATE faq SET faqQ = ? , faqA = ? , category = ? WHERE faqId =  ? ',
    [req.body.faq_Q,req.body.faq_A,req.body.faq_category,req.body.faq_id],(err,result)=>{
        if(err) err_service.errorNotification(err,'updateFAQ')
        res.send({
            status:true,
            msg:'บันทึกสำเร็จ'
        })
    })
}
//delete FAQ
module.exports.deleteFAQ = (req,res) => {
    id = req.params.id
    dbConn.query('DELETE FROM faq WHERE faqId = ?',[id],(err,result)=>{
        if(err) err_service.errorNotification(err,'deleteFAQ')
        res.send({
            status:true,
            msg:'ลบสำเร็จ'
        })
    })
}
//change status FAQ (on-off)
module.exports.changeStatusFAQ = (req,res) => {
    dbConn.query('SELECT displayStatus FROM faq WHERE faqId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'change status faq => get status by id')
        console.log(result[0].displayStatus);
        let newStatus
        if(result[0].displayStatus === 0){
            newStatus = 1
        }else if(result[0].displayStatus === 1){
            newStatus = 0
        }
        dbConn.query('UPDATE faq SET displayStatus = ? WHERE faqId = ?',[newStatus,req.params.id],(err,result)=>{
            if(err) err_service.errorNotification(err,'change status faq => chang status')
            if(newStatus === 1){
                res.send({
                    status:true,
                    msg:'เปิดใช้งานเรียบร้อย'
                })
            }else if(newStatus === 0){
                res.send({
                    status:true,
                    msg:'ปิดใช้งานเรียบร้อย'
                })
            }

        })
    })
}

//***************************************************************************** */
// money transfer
//***************************************************************************** */
//add new money transfer
module.exports.addMoneyTransfer = (req,res) => {
    console.log(req.body);
    userId = req.body.userId
    packageId = req.body.packageId
    packagePrice = req.body.packagePrice
    packagePeriod = String(req.body.packagePeriod)
    image = req.body.gallery[0]
    dateTransfer = req.body.dateTransfer

    sqlLineNotify = `
    SELECT
        money_transfer.* ,
        users.fname AS userFname ,
        users.lname AS userLname ,
        users.id AS userId ,
        users.pictureUrl AS userImage ,
        package.name AS packageName
    FROM money_transfer
    INNER JOIN users ON money_transfer.userId = users.id
    INNER JOIN package ON money_transfer.packageId = package.id
    WHERE money_transfer.userId = ${userId}
    ORDER BY money_transfer.id DESC LIMIT 1;`

    sql=`INSERT INTO money_transfer(userId,packageId,periodId,price,pictureUrl,dateTransfer)
        VALUES(${userId},${packageId},'${packagePeriod}','${packagePrice}','${image}','${dateTransfer}');`
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'add money transfer')
            dbConn.query(sqlLineNotify,(err,result)=>{
                if(err)err_service.errorNotification(err,'get data for line ')
                line_ct.lineNotify(result)
            })
            res.send({
                status:true,
                msg:'เพิ่มการแจ้งโอนเงินเรียบร้อย'
            })
        })

}

//get all money transfer list
module.exports.getAllMoneyTransfer = (req,res) => {
    console.log(req.body);
    sqlLength = `
    SELECT
        COUNT(*) AS length
    FROM money_transfer`

    sql = `
    SELECT
        money_transfer.* ,
        users.fname AS userFname ,
        users.lname AS userLname ,
        users.id AS userId ,
        users.pictureUrl AS userImage ,
        package.name AS packageName
    FROM money_transfer
    INNER JOIN users ON money_transfer.userId = users.id
    INNER JOIN package ON money_transfer.packageId = package.id
    ORDER BY FIELD(money_transfer.confirm,'0') DESC , money_transfer.id DESC
    LIMIT ${req.body.items},${req.body.size} ;`
    dbConn.query(sqlLength,(err,result)=>{
        length = result[0].length
        dbConn.query(sql,(err,result)=>{
            if(err) err_service.errorNotification(err,'get all money transfer list')
            res.send({
                status:true,
                data:result,
                length:length,
                imagePathPayment:process.env.IMAGE_PATH_PAYMENT,
                imagePathUser:process.env.IMAGE_PATH_AVATAR
            })
        })
    })
}
//confirm money transfer
module.exports.confirmMoneyTransfer = (req,res) => {
    console.log(req.body);
    moneyTransferConfirm = req.body.status
    id = req.body.id
    sql = `UPDATE money_transfer SET confirm = ${moneyTransferConfirm} WHERE id = ${id}`

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'confirm money transfer')
        res.send({
            status:true,
            msg:'ยืนยันเรียบร้อยแล้ว'
        })
    })
}
//delete money transfer
module.exports.deleteMoneyTransfer = (req,res) => {
    id = req.params.id
    dbConn.query(`DELETE FROM money_transfer WHERE id = ${id}`,(err,result)=>{
        if(err) err_service.errorNotification(err,'delete money transfer')
        res.send({
            status:true,
        })
    })
}
//seach money Transfer
module.exports.seachMoneyTransfer = (req,res) => {
    console.log(req.body);
    seachText = req.body.seachText
    confirmStatus = req.body.confirmStatus
    limit = req.body.limit
    if(seachText !== null){
        seachText = `'${seachText}%'`
    }
    sqlLength =
    `
        SELECT
            users.fname AS userFname,
            users.lname AS userLname,
            users.pictureUrl AS userImage ,
            money_transfer.*
        FROM money_transfer
        INNER JOIN users ON money_transfer.userId = users.id
        WHERE
        (
            (
                ((CONCAT(users.fname,' ',users.lname) LIKE ${seachText}) OR  ${seachText} is null)
                OR ((CONCAT(users.fname,'',users.lname) LIKE  ${seachText}) OR  ${seachText} is null)
            )
            AND (money_transfer.confirm = ${confirmStatus} OR ${confirmStatus} is null)
        );`
    sql = `
        SELECT
            users.fname AS userFname,
            users.lname AS userLname,
            users.pictureUrl AS userImage ,
            money_transfer.*
        FROM money_transfer
        INNER JOIN users ON money_transfer.userId = users.id
        WHERE
        (
            (
                ((CONCAT(users.fname,' ',users.lname) LIKE ${seachText}) OR  ${seachText} is null)
                OR ((CONCAT(users.fname,'',users.lname) LIKE  ${seachText}) OR  ${seachText} is null)
            )
            AND
                (money_transfer.confirm = ${confirmStatus} OR ${confirmStatus} is null)

        )
        ORDER BY money_transfer.id DESC
        LIMIT ${limit.items},${limit.size};`
        // console.log(sql);
    dbConn.query(sqlLength,(err,result)=>{
        length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'seach user money transfer')
            res.send({
                status:true,
                data:result,
                imagePath:process.env.IMAGE_PATH_AVATAR,
                length:length
            })
        })
    })

}


//***************************************************************************** */
// Report
//***************************************************************************** */
//user report
module.exports.userReport = (req,res)=>{
    // limit = req.body
    sqlLength = `SELECT * FROM user_report_users GROUP BY userId;`

    sql =`
        SELECT
            user_report_users.id AS id,
            user_report_users.userId AS userId,
            COUNT(user_report_users.userId) AS reportCount ,
            user_report_users.userReportedId AS userReporterId,
            user_report_users.detailReportId AS reportDetailId,
            user_report_users.description AS description ,
            detail_report_users.name AS reportTopic ,
            users.fname AS userFname ,
            users.lname AS userLname ,
            users.pictureUrl AS image
        FROM user_report_users
        INNER JOIN users ON users.id = user_report_users.userId
        INNER JOIN detail_report_users ON detail_report_users.id = user_report_users.detailReportId
        GROUP BY user_report_users.userId
        ORDER BY reportCount DESC
        LIMIT ${req.body.items},${req.body.size};`

    dbConn.query(sqlLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'get length report user')
        length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'get user reported ')
            res.send({
                status:true,
                data:result,
                length:length,
                imagePath: process.env.IMAGE_PATH_AVATAR
            })
        })
    })
}
//get reporter
module.exports.userReporter = (req,res) => {
    sql =`
    SELECT
        user_report_users.*,
        users.*
    FROM users
    INNER JOIN user_report_users ON user_report_users.userReportedId = users.id
    WHERE user_report_users.userId = ${req.params.id};`


    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'get Reporter List')
        console.log(result);
        res.send({
            status:true,
            data:result,
            imagePath:process.env.IMAGE_PATH_AVATAR
        })
    })
}
//confirm report
module.exports.confirmUserReport = (req,res) => {
    console.log(req.params.id);
    sql = `DELETE FROM user_report_users WHERE userId = ${req.params.id};`
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'confirm user report ')
        res.send({
            status:true,
            msg:'ยืนยันเรียบร้อยแล้ว'
        })
    })
}
//add property report topic
module.exports.addPropertyReportTopic = (req,res) => {
    sql =`
        INSERT INTO
            detail_report_properties(name,description)
            VALUES('${req.body.name}','${req.body.desc}');
    `

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,' set property report topic ')
            res.send({
                status:true,
                msg:'เพิ่มหัวข้อการแจ้งรายงานเรียบร้อย'
        })
    })
}
//update prpoerty report topic
module.exports.updatePropertyReportTopic = (req,res) => {
    id = req.body.id
    topicName = req.body.name
    desc = req.body.desc
    sql = `
        UPDATE
            detail_report_properties
        SET name = '${topicName}',
            description = '${desc}'
        WHERE id = ${id} ;
    `

    console.log(req.body);
    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'update property report topic ')
        res.send({
            status:true,
            msg:'บันทึกเรียบร้อยแล้ว'
        })
    })
}
//get property report topic
module.exports.getAllPropertyReportTopic = (req,res) => {
    sql =`
    SELECT
        *
    FROM detail_report_properties
    ORDER BY FIELD(name,"อื่นๆ") ASC
    `

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get all property report topic')
        res.send({
            status:true,
            data:result
        })
    })
}
//delete property report topic
module.exports.deletePropertyReportTopic = (req,res) => {
    sql =`
    DELETE FROM
        detail_report_properties
    WHERE id = ${req.params.id}
    `

dbConn.query(sql,(err,result)=>{
    if(err)err_service.errorNotification(err,'delete property Report Topic')
    res.send({
        status:true,
        msg:'ลบหัวข้อการแจ้งเตือนเรียบร้อย'
    })
})
}

//add user New Report Topic
module.exports.addNewReportTopic = (req,res) => {

    sql =`
        INSERT INTO
            detail_report_users(name,description)
            VALUES('${req.body.name}','${req.body.desc}');
        `
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,' set user report topic ')
            res.send({
                status:true,
                msg:'เพิ่มหัวข้อการแจ้งรายงานเรียบร้อย'
        })
    })
}
//update user report topic
module.exports.updateReportTopic = (req,res) => {

    id = req.body.id
    topicName = req.body.name
    desc = req.body.desc
    sql = `
        UPDATE
            detail_report_users
        SET name = '${topicName}',
            description = '${desc}'
        WHERE id = ${id} ;
    `
    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'update report topic ')
        res.send({
            status:true,
            msg:'บันทึกเรียบร้อยแล้ว'
        })
    })

}
//get user report topic
module.exports.getAllReportTopic = (req,res) => {

    sql =`
        SELECT
            *
        FROM detail_report_users
        ORDER BY FIELD(name,"อื่นๆ") ASC
        `

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get all report topic')
        res.send({
            status:true,
            data:result
        })
    })

}
//delete user Report Topic
module.exports.deleteReportTopic = (req,res) => {
    sql =`
        DELETE FROM
            detail_report_users
        WHERE id = ${req.params.id}
        `

    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'delete Report Topic')
        res.send({
            status:true,
            msg:'ลบหัวข้อการแจ้งเตือนเรียบร้อย'
        })
    })
}
