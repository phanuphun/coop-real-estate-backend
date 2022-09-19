let dbConn = require('../database')
let err_service = require('./../../service/err_service')

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
            user_report_users.userReportedId AS userReporterId,
            COUNT(user_report_users.userId) AS reportCount ,
            user_report_users.userId AS userId,
            user_report_users.detailReportId AS reportDetailId,
            user_report_users.description AS description ,
            detail_report_users.name AS reportTopic ,
            users.fname AS userFname ,
            users.lname AS userLname ,
            users.displayStatus AS displayStatus,
            users.pictureUrl AS image
        FROM user_report_users
        INNER JOIN users ON users.id = user_report_users.userReportedId
        INNER JOIN detail_report_users ON detail_report_users.id = user_report_users.detailReportId
        GROUP BY user_report_users.userReportedId
        ORDER BY 
                users.displayStatus DESC ,
                reportCount DESC , 
                users.displayStatus DESC
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
        FROM user_report_users
        INNER JOIN users ON users.id = user_report_users.userId
        WHERE user_report_users.userReportedId = ${req.params.id};
    `


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
    sqlDeleteUser = `
        DELETE FROM user_report_users 
        WHERE userReportedId = ${req.params.id};
    `
    sqlUnbanned = `
        UPDATE users SET displayStatus = 1 
        WHERE id = ${req.params.id}
    `
    console.log('id',req.params.id);
    dbConn.query(sqlUnbanned,(err,result)=>{
        if(err) err_service.errorNotification(err,'confirm user report ')
        dbConn.query(sqlDeleteUser,(err,result)=>{
            if(err) err_service.errorNotification(err,'confirm user report => UnBanned')
            res.send({
                status:true,
                msg:'ยืนยันเรียบร้อยแล้ว'
            })
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
//get all property reported
module.exports.getAllPropertyReport = (req,res) => {
    sqlLength = `SELECT * FROM user_report_properties GROUP BY propertyId;`

    sql = `SELECT
            user_report_properties.id AS propReportId ,
            detail_report_properties.name AS reportTopicName,
            detail_report_properties.description AS reportTopicDesc,
            COUNT(user_report_properties.propertyId) AS reportCount ,
            users.id AS userId ,
            users.fname AS userFname ,
            users.lname AS userLname ,
            user_sub_props.*
        FROM user_report_properties
        INNER JOIN user_sub_props ON user_sub_props.id = user_report_properties.propertyId
        INNER JOIN users ON users.id = user_report_properties.userId
        INNER JOIN detail_report_properties ON detail_report_properties.id = user_report_properties.detailReportId
        GROUP BY user_report_properties.propertyId
        ORDER BY reportCount DESC
        LIMIT ${req.body.items},${req.body.size};`
    dbConn.query(sqlLength,(err,result)=>{
        if(err) err_service.errorNotification(err,'get length report props')
        length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err) err_service.errorNotification(err,'property report')
            let propertyData
            propertyData = result
            console.log(propertyData.length);
            if(propertyData.length === 0){
                res.send({
                    status:true,
                    data:propertyData,
                    length:length,
                    imagePath:process.env.IMAGE_PATH_PROPERTY
                })
            }else{
                for(let i = 0 ; i < propertyData.length ; i++){
                    id = propertyData[i].id
                    dbConn.query(`SELECT path AS image FROM user_sub_prop_galleries WHERE propertyId = ? GROUP BY propertyId`,[id],(err,result)=>{
                        if(result.length > 0){
                            propertyData[i].image = result[0].image
                        }

                        if((i+1) ==  propertyData.length){
                            res.send({
                                status:true,
                                data:propertyData,
                                length:length,
                                imagePath:process.env.IMAGE_PATH_PROPERTY
                            })
                        }
                    })
                }
            }
        })
    })

}
//confirm property reported report
module.exports.confirmPropertyReport = (req,res) => {
    dbConn.query('DELETE FROM user_report_properties WHERE propertyId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'confirm property report')
        res.send({
            status:true,
            msg:'นำรายการออกจากรายชื่อที่ถูกรายงานเรียบร้อย'
        })
    })
}
//property reporter(user) list
module.exports.getReporterList = (req,res)=>{
    sql = `
        SELECT
            users.*,
            user_report_properties.*
        FROM users
        INNER JOIN user_report_properties ON user_report_properties.userId = users.id
        WHERE user_report_properties.propertyId = ${req.params.id};`
    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'get Reporter List')
        res.send({
            status:true,
            data:result,
            imagePath:process.env.IMAGE_PATH_AVATAR
        })
    })
}
//property report length
module.exports.propertyReportLength = (req,res) =>{
    sql = `
        SELECT
            COUNT(*) AS length
        FROM user_report_properties
        GROUP BY propertyId
    `

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get property report length')
        res.send({
            status:true,
            length:result.length
        })
    })
}
//user report length
module.exports.userReportLength = (req,res) =>{
    sql = `
        SELECT
            COUNT(*) AS length
        FROM user_report_users
        GROUP BY userId
    `

    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get property report length')
        res.send({
            status:true,
            length:result.length
        })
    })
}
// banned user 
module.exports.bannedUser = (req,res) => {
    dbConn.query('SELECT displayStatus FROM users WHERE id = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'change status users => get status by id')
        console.log(result[0].displayStatus);
        let newStatus
        if(result[0].displayStatus === 0){
            newStatus = 1
        }else if(result[0].displayStatus === 1){
            newStatus = 0
        }
        dbConn.query('UPDATE users SET displayStatus = ? WHERE id = ?',[newStatus,req.params.id],(err,result)=>{
            if(err) err_service.errorNotification(err,'change status users => chang status')
            if(newStatus === 1){
                res.send({
                    status:true,
                    msg:'ปลดการระงับบัญชีเรียบร้อย'
                })
            }else if(newStatus === 0){
                res.send({
                    status:true,
                    msg:'ระงับบัญชีผู้ใช้งานเรียบร้อย'
                })
            }

        })
    })
}
