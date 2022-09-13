const date = require('date-and-time')
let dbConn = require('../database')
let err_service = require('./../../service/err_service')
let line_ct = require('./other_controller')
let multer_s = require('./../../service/multer')

//***************************************************************************** */
// money transfer
//***************************************************************************** */
// overview
module.exports.moneyTransferOverview = (req,res) => {
    sqlPopularPackage = `
        SELECT
            COUNT(money_transfer.packageId) AS packageLength ,
            package.name AS packageName
        FROM money_transfer
        INNER JOIN package ON package.id = money_transfer.packageId
        WHERE money_transfer.confirm = 1
        GROUP BY money_transfer.packageId
        ORDER BY packageLength DESC
        LIMIT 1;
    `
    sqlMostSubScription = `
        SELECT
            COUNT(money_transfer.userId) AS userLength ,
            users.fname AS userFname,
            users.lname AS userLname,
            users.pictureUrl AS userImage
        FROM money_transfer
        INNER JOIN users ON users.id = money_transfer.userId
        WHERE money_transfer.confirm = 1
        GROUP BY money_transfer.userId
        ORDER BY userLength DESC;
    `
    sqlSubsciberLength =`
        SELECT
            COUNT(money_transfer.userId) AS length
        FROM money_transfer
        INNER JOIN users ON users.id = money_transfer.userId
        WHERE (money_transfer.confirm = 1  AND (users.packageExpire > cast(now() AS date)))
        GROUP BY money_transfer.userId
        ORDER BY length DESC;
    `
    sqlWaitingConfirm =`
        SELECT 
            COUNT(*) AS waitingConfirm
        FROM money_transfer
        WHERE confirm = 0;
    `
    sqlAllmoneyTransfer =`
        SELECT 
            COUNT(*) AS allMoneyTransfer
        FROM money_transfer;
        `
    let data = {}
    dbConn.query(sqlPopularPackage,(err,result)=>{
        if(err)err_service.errorNotification(err,'overview money transfer => popular package')
        if(result.length > 0){
            data.popularPackge = result[0].packageName
        }else{
            data.popularPackge = 'unknow'
        }
        dbConn.query(sqlMostSubScription,(err,result)=>{
            if(err)err_service.errorNotification(err,'overview money transfer => user most subscrition')
            data.userMostSubscrition = 'unknow'
            data.userImage = 'unknow'
            if(result.length > 0){
                data.userMostSubscrition = result[0].userFname + ' ' + result[0].userLname
                data.userImage = result[0].userImage
            }
            dbConn.query(sqlSubsciberLength,(err,result)=>{
                if(err)err_service.errorNotification(err,'overview money transfer => user most subscrition')
                data.subscitionLength = result.length
                dbConn.query(sqlWaitingConfirm,(err,result)=>{
                    if(err)err_service.errorNotification(err,'overview money transfer => wating confirm')
                    data.moneyTransferWaitingConfirm = result[0].waitingConfirm
                    dbConn.query(sqlAllmoneyTransfer,(err,result)=>{
                        if(err)err_service.errorNotification(err,'overview money transfer => all moeny transfer')
                        data.allMoneyTransfer = result[0].allMoneyTransfer
                        res.send({
                            status:true,
                            data:data,
                            imagePathUser:process.env.IMAGE_PATH_AVATAR
                        })
                    })

                })
            })
        })
    })


}
//add new money transfer
module.exports.addMoneyTransfer = (req,res) => {
    // console.log(req.body);
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
    // console.log(req.body);
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
//get new money transfer length
module.exports.getNewMoneyTransfer = (req,res) => {
    sqlLength = `
        SELECT
            COUNT(*) AS length
        FROM  money_transfer
        WHERE confirm = 0
    `

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
    WHERE money_transfer.confirm = 0
    ORDER BY money_transfer.id DESC
    LIMIT 10;`


    dbConn.query(sqlLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'get new money transfer length')
        length = result[0].length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'get new money transfer length => limit data 10 ')
            // console.log(result);
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
//get money transfer list by user id
module.exports.getMoneyTransferByUserId = (req,res)=> {
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
    WHERE money_transfer.userId = ${req.params.id}
    ORDER BY FIELD(money_transfer.confirm,'0') DESC , money_transfer.id DESC
    `
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get all money transfer list')
        res.send({
            status:true,
            data:result,
            imagePathPayment:process.env.IMAGE_PATH_PAYMENT,
            imagePathUser:process.env.IMAGE_PATH_AVATAR
        })
    })

}
//confirm money transfer
module.exports.confirmMoneyTransfer = (req,res) => {
    // console.log(req.body);
    moneyTransferConfirm = req.body.status
    id = req.body.id
    userId = req.body.userId
    periodId = req.body.periodId
    packageId = req.body.packageId

    sqlUpdateConfirm = `
        UPDATE money_transfer
        SET confirm = ${moneyTransferConfirm}
        WHERE id = ${id};
        `
    sqlGetPeriod = `
        SELECT
            period
        FROM subscription_period
        WHERE id = ${periodId};
    `
    sqlOldExpirePackage = `
        SELECT
            packageId,
            packageExpire
        FROM users
        WHERE id = ${userId}
    `
    dbConn.query(sqlUpdateConfirm,(err,result)=>{
        if(err) err_service.errorNotification(err,'confirm money transfer')
        if(moneyTransferConfirm === 1 ){
            dbConn.query(sqlGetPeriod,(err,result)=>{
                if(err)err_service.errorNotification(err,'confirm money transfer => get period before update date')
                period = result[0].period
                dbConn.query(sqlOldExpirePackage,(err,result)=>{
                    if(err)err_service.errorNotification(err,'confirm money transfer => get old expire package user ')
                    oldPackage = result[0].packageId
                    oldExp = date.format(result[0].packageExpire,'YYYY/MM/DD HH:mm:ss')
                        //กรณีต่อ package
                        sqlUpdatePackageUpgrade = `
                        UPDATE users
                        SET packageId = ${packageId},
                            subscriptionPeriodId = ${periodId},
                            packageExpire = ADDDATE('${oldExp}', INTERVAL +${period} MONTH)
                        WHERE id = ${userId}
                        `
                        //กรณีสมัครครั้งแรกอัพจากแพ็คเกจ Free
                        sqlUpdatePackageFirstTime = `
                        UPDATE users
                        SET packageId = ${packageId},
                            subscriptionPeriodId = ${periodId},
                            packageExpire = ADDDATE(CURRENT_TIMESTAMP(), INTERVAL +${period} MONTH)
                        WHERE id = ${userId}
                        `
                        let sqlUpdatePackage
                        if(oldPackage === 1 ){
                            sqlUpdatePackage = sqlUpdatePackageFirstTime
                        }else{
                            sqlUpdatePackage = sqlUpdatePackageUpgrade
                        }

                    // console.log(sqlUpdatePackage);
                    dbConn.query(sqlUpdatePackage,(err,result)=>{
                        if(err)err_service.errorNotification(err,'confirm money transfer => update package and expire packge in users table ')
                        res.send({
                            status:true,
                            msg:'ยืนยันเรียบร้อยแล้ว'
                        })
                    })
                })
            })
        }else{
            res.send({
                status:true,
                msg:'ยืนยันเรียบร้อยแล้ว'
            })
        }
    })
}
//delete money transfer
module.exports.deleteMoneyTransfer = (req,res) => {
    id = req.params.id
    sqlGetImage = `
        SELECT
            pictureUrl
        FROM money_transfer
        WHERE id = ${id}
    `
    dbConn.query(sqlGetImage,(err,result)=>{
        if(err) err_service.errorNotification(err,'delete money transfer => get image')
            let image = result[0].pictureUrl
            multer_s.deleteImage('payment/'+image)
            dbConn.query(`DELETE FROM money_transfer WHERE id = ${id}`,(err,result)=>{
                if(err) err_service.errorNotification(err,'delete money transfer')
                res.send({
                    status:true,
                })
            })
    })
}
//seach money Transfer
module.exports.seachMoneyTransfer = (req,res) => {
    // console.log(req.body);
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
            package.name AS packageName,
            money_transfer.*
        FROM money_transfer
        INNER JOIN users ON money_transfer.userId = users.id
        INNER JOIN package ON package.id = money_transfer.packageId
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

//delete money transfer before delete user
module.exports.deleteMoneyTransferByDeleteUser = (id) => {
    sqlGetImage = `
        SELECT
            pictureUrl
        FROM money_transfer
        WHERE id = ${id}
    `
    dbConn.query(sqlGetImage,(err,result)=>{
        if(err) err_service.errorNotification(err,'delete money transfer => get image')
            let image = result[0].pictureUrl
            multer_s.deleteImage('payment/'+image)
            dbConn.query(`DELETE FROM money_transfer WHERE id = ${id}`,(err,result)=>{
                if(err) err_service.errorNotification(err,'delete money transfer')
            })
    })
}
