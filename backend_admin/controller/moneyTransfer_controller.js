const date = require('date-and-time')
let dbConn = require('../database')
let err_service = require('./../../service/err_service')
let line_ct = require('./other_controller')
let multer_s = require('./../../service/multer')
const dateAndTime = require('date-and-time')

//***************************************************************************** */
// money transfer
//***************************************************************************** */
// inCome 
module.exports.inComeChartData = (req,res) => {
    sqlDailyIncome = `
    SELECT 
        count(id) as orderCount ,
        sum(price) as totalDailyIncomePerDay ,
        cast(dateTransfer as date) as days,
        ADDDATE(cast(current_timestamp() as date), INTERVAL -6 DAY)  as days_6,
        cast(current_timestamp() as date) as currentTime

    FROM money_transfers
    WHERE confirm = 1 AND 
            (cast(dateTransfer AS date) BETWEEN 
                ADDDATE(cast(current_timestamp() as date), INTERVAL -6 DAY) 
                AND 
                cast(current_timestamp() as date) 
            )
    GROUP BY cast(dateTransfer AS date)
    ORDER BY days ASC
    LIMIT 7;
    `
    oldSqlDailyIncome = `SELECT 
                COUNT(id) AS orderCount ,
                SUM(price) AS totalDailyIncomePerDay ,
                dateTransfer AS days
            FROM money_transfers
            WHERE confirm = 1 AND (dateTransfer BETWEEN ADDDATE(CURRENT_TIMESTAMP(), INTERVAL -6 DAY) AND CURRENT_TIMESTAMP())
            GROUP BY CAST(dateTransfer AS DATE)
            ORDER BY days ASC
            LIMIT 7;`

    sqlMonthIncome = `
        SELECT 
            COUNT(id) AS orderCount ,
            SUM(price) AS totalMonthIncomePerMonth ,
            date_format(dateTransfer, '%m') AS monthNo
        FROM money_transfers
        WHERE confirm = 1 
                AND 
            (date_format(CURRENT_TIMESTAMP, '%Y') = date_format(dateTransfer, '%Y'))
        GROUP BY monthNo
        ORDER BY monthNo ASC
        LIMIT 12;
    `
    sqlYearIncome = `
        SELECT 
            COUNT(id) AS orderCount ,
            SUM(price) AS totalYearIncomePerYear ,
            date_format(dateTransfer, '%Y') AS years
        FROM money_transfers
        WHERE confirm = 1 
                AND 
            (date_format(CURRENT_TIMESTAMP, '%Y') >= date_format(dateTransfer, '%Y'))
        GROUP BY years
        ORDER BY years ASC
        LIMIT 5;
    `

    sqlAllIncome =`
        SELECT 
            SUM(price) AS totalIncome
        FROM money_transfers
        WHERE confirm = 1 
    `

    data = {}

    dbConn.query(sqlDailyIncome,(err,result)=>{
        if(err)err_service.errorNotification(err,'overview money transfer => daily income ')
        let orderCount = []
        let totalDailyIncomePerDay = []
        let days = []
        let oneWeeks = []
        let dailyIncome = {} 
        if(result.length > 0){
            for(let i = 0 ; i < result.length ; i++){
                orderCount[i] = result[i].orderCount
                totalDailyIncomePerDay[i] = result[i].totalDailyIncomePerDay
                days[i] = dateAndTime.format(result[i].days,'YYYY/MM/DD')
            }
            // get days 
            // console.log('day => ',new Date(days[0]).getDate() +1 );
            
            dailyIncome.orderCount = orderCount
            dailyIncome.totalDailyIncomePerDay = totalDailyIncomePerDay
            dailyIncome.days = days
            // console.log(dailyIncome.days );

        }
        dailyIncome.totalDailyIncome = totalDailyIncomePerDay.reduce((sum, a) => sum + a, 0)
        dailyIncome.totalDailyOrderCount = orderCount.reduce((sum, a) => sum + a, 0)
        data.dailyIncome = dailyIncome
        // console.log(data.dailyIncome);
        let dateNow = new Date()
        oneWeeks[0] = dateAndTime.format(new Date(dateNow.setDate(dateNow.getDate())),'YYYY/MM/DD')
        for (let i = 1 ; i < 7; i++) {
            oneWeeks.push(dateAndTime.format(new Date(dateNow.setDate(dateNow.getDate()-1)),'YYYY/MM/DD'))
        }
        oneWeeks = oneWeeks.reverse()
        for (let i = 0 , j = 0; i < oneWeeks.length ; i ++, j++) {
            // console.log(new Date(oneWeeks[i]).getDate() + '==' + new Date(dailyIncome.days[j]).getDate())
            // console.log(i, new Date(daily.days[i]).getDate() !== new Date(daily.oldDays[j]).getDate())
            if (new Date(oneWeeks[i]).getDate() !== new Date(dailyIncome.days[j]).getDate()){
                dailyIncome.totalDailyIncomePerDay.splice(i,0,0);
                j-- ; 
            }
        }

        dailyIncome.days = oneWeeks
        
        dbConn.query(sqlMonthIncome,(err,result)=>{
            if(err)err_service.errorNotification(err,'overview money transfer => year income ')
            let month = [
                "มกราคม", 
                "กุมภาพันธ์", 
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม"
            ]
            let monthShort = [ "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."]
            let totalMonthIncomePerMonth = [0,0,0,0,0,0,0,0,0,0,0,0] 
            let monthIncome = {} 
            for(let i = 0 , j = 0 ; i < 12 ; i++){
                if(j < result.length){
                    if(i === (parseInt(result[j].monthNo)-1)){
                        totalMonthIncomePerMonth[i] = result[j].totalMonthIncomePerMonth
                        // console.log(month[i]);
                        j++ ;
                    }
                }
            }
            for(let i = 0 ; i < result.length ; i++) {
                orderCount[i] = result[i].orderCount
            }
            monthIncome.totalMonthIncome = totalMonthIncomePerMonth.reduce((sum, a) => sum + a, 0)
            monthIncome.totalMonthOrderCount = orderCount.reduce((sum, a) => sum + a, 0)
            monthIncome.totalMonthIncomePerMonth = totalMonthIncomePerMonth
            monthIncome.month = month
            monthIncome.monthShort = monthShort
            data.monthIncome = monthIncome
            dbConn.query(sqlYearIncome,(err,result)=>{
                if(err)err_service.errorNotification(err,'overview money transfer => year income ')
                let yearIncome = {}
                let years = []
                let totalYearIncomePerYear = []
                let orderCount = []
                for(let i = 0 ; i < result.length ; i++ ){
                    orderCount[i] = result[i].orderCount;
                    years[i] = result[i].years;
                    totalYearIncomePerYear[i] = result[i].totalYearIncomePerYear;
                }
                if(years.length < 5 ){
                    for(let i = (years.length)-1 ; i < 4 ; i++ ){
                        years.unshift(parseInt(years[0])-1)
                        totalYearIncomePerYear.unshift(0)
                    }
                }
                years.length = 5 
                totalYearIncomePerYear.length = 5
                yearIncome.totalYearIncome = totalYearIncomePerYear.reduce((sum, a) => sum + a, 0)
                yearIncome.totalYearOrderCount = orderCount.reduce((sum, a) => sum + a, 0)
                yearIncome.totalYearIncomePerYear = totalYearIncomePerYear;
                yearIncome.orderCount = orderCount;
                yearIncome.years = years;
                data.yearIncome = yearIncome;

                dbConn.query(sqlAllIncome,(err,result)=>{
                    if(err)err_service.errorNotification(err,'overview money transfer => year income ')
                    let totalAllIncome = result[0].totalIncome
                    
                    data.totalAllIncome = totalAllIncome
                    res.send({
                        status:true,
                        data:data,
                    })
                })

            })
        })
    })

}
// money transfer overview
module.exports.moneyTransferOverview = (req,res) => {
    sqlPopularPackage = `
        SELECT
            COUNT(money_transfers.packageId) AS packageLength ,
            packages.name AS packageName
        FROM money_transfers
        INNER JOIN packages ON packages.id = money_transfers.packageId
        WHERE money_transfers.confirm = 1
        GROUP BY money_transfers.packageId
        ORDER BY packageLength DESC
        LIMIT 1;
    `
    sqlMostSubScription = `
        SELECT 
            users.id AS userId,
            users.fname AS userFname,
            users.lname AS userLname, 
            users.pictureUrl AS userImage,
            COUNT(money_transfers.id) AS orderCountPackage,
            SUM(money_transfers.price) AS totalPricePackage
        FROM money_transfers
        INNER JOIN users ON users.id = money_transfers.userId
        GROUP BY money_transfers.userId
        ORDER BY totalPricePackage DESC
        LIMIT 1;
    `
    sqlSubsciberLength =`
        SELECT
            COUNT(money_transfers.userId) AS length
        FROM money_transfers
        INNER JOIN users ON users.id = money_transfers.userId
        WHERE (money_transfers.confirm = 1  AND (users.packageExpire > cast(now() AS date)))
        GROUP BY money_transfers.userId
        ORDER BY length DESC;
    `
    sqlWaitingConfirm =`
        SELECT 
            COUNT(*) AS waitingConfirm
        FROM money_transfers
        WHERE confirm = 0;
    `
    sqlAllmoneyTransfer =`
        SELECT 
            COUNT(*) AS allMoneyTransfer
        FROM money_transfers;
        `
    
    let data = {}
    dbConn.query(sqlPopularPackage,(err,result)=>{
        if(err)err_service.errorNotification(err,'overview money transfer => popular package')
        if(result.length > 0){
            data.popularPackge = result[0].packageName
        }else{
            data.popularPackge = null
        }
        dbConn.query(sqlMostSubScription,(err,result)=>{
            if(err)err_service.errorNotification(err,'overview money transfer => user most subscrition')
            data.userMostSubscrition = null
            if(result.length > 0){
                data.userMostSubscrition = result[0]
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
        money_transfers.* ,
        users.fname AS userFname ,
        users.lname AS userLname ,
        users.id AS userId ,
        users.pictureUrl AS userImage ,
        packages.name AS packageName
    FROM money_transfers
    INNER JOIN users ON money_transfers.userId = users.id
    INNER JOIN packages ON money_transfers.packageId = packages.id
    WHERE money_transfers.userId = ${userId}
    ORDER BY money_transfers.id DESC LIMIT 1;`

    sql=`INSERT INTO money_transfers(
                        userId,
                        packageId,
                        periodId,
                        price,
                        pictureUrl,
                        dateTransfer,
                        confirm)
                    VALUES(
                        ${userId},
                        ${packageId},
                        '${packagePeriod}',
                        '${packagePrice}',
                        '${image}',
                        '${dateTransfer}',
                        0);
        `        
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
    FROM money_transfers`

    sql = `
    SELECT
        money_transfers.* ,
        users.fname AS userFname ,
        users.lname AS userLname ,
        users.id AS userId ,
        users.pictureUrl AS userImage ,
        packages.name AS packageName
    FROM money_transfers
    INNER JOIN users ON money_transfers.userId = users.id
    INNER JOIN packages ON money_transfers.packageId = packages.id
    ORDER BY FIELD(money_transfers.confirm,'0') DESC , money_transfers.id DESC
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
        FROM  money_transfers
        WHERE confirm = 0
    `

    sql = `
    SELECT
        money_transfers.* ,
        users.fname AS userFname ,
        users.lname AS userLname ,
        users.id AS userId ,
        users.pictureUrl AS userImage ,
        packages.name AS packageName
    FROM money_transfers
    INNER JOIN users ON money_transfers.userId = users.id
    INNER JOIN packages ON money_transfers.packageId = packages.id
    WHERE money_transfers.confirm = 0
    ORDER BY money_transfers.id DESC
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
        money_transfers.* ,
        users.fname AS userFname ,
        users.lname AS userLname ,
        users.id AS userId ,
        users.pictureUrl AS userImage ,
        packages.name AS packageName
    FROM money_transfers
    INNER JOIN users ON money_transfers.userId = users.id
    INNER JOIN packages ON money_transfers.packageId = packages.id
    WHERE money_transfers.userId = ${req.params.id}
    ORDER BY FIELD(money_transfers.confirm,'0') DESC , money_transfers.id DESC
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
        UPDATE money_transfers
        SET confirm = ${moneyTransferConfirm}
        WHERE id = ${id};
        `
    sqlGetPeriod = `
        SELECT
            period
        FROM subscription_periods
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
        FROM money_transfers
        WHERE id = ${id}
    `
    dbConn.query(sqlGetImage,(err,result)=>{
        if(err) err_service.errorNotification(err,'delete money transfer => get image')
            let image = result[0].pictureUrl
            multer_s.deleteImage('payment/'+image)
            dbConn.query(`DELETE FROM money_transfers WHERE id = ${id}`,(err,result)=>{
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
            money_transfers.*
        FROM money_transfers
        INNER JOIN users ON money_transfers.userId = users.id
        WHERE
        (
            (
                ((CONCAT(users.fname,' ',users.lname) LIKE ${seachText}) OR  ${seachText} is null)
                OR ((CONCAT(users.fname,'',users.lname) LIKE  ${seachText}) OR  ${seachText} is null)
            )
            AND (money_transfers.confirm = ${confirmStatus} OR ${confirmStatus} is null)
        );`
    sql = `
        SELECT
            users.fname AS userFname,
            users.lname AS userLname,
            users.pictureUrl AS userImage ,
            packages.name AS packageName,
            money_transfers.*
        FROM money_transfers
        INNER JOIN users ON money_transfers.userId = users.id
        INNER JOIN packages ON packages.id = money_transfers.packageId
        WHERE
        (
            (
                ((CONCAT(users.fname,' ',users.lname) LIKE ${seachText}) OR  ${seachText} is null)
                OR ((CONCAT(users.fname,'',users.lname) LIKE  ${seachText}) OR  ${seachText} is null)
            )
            AND
                (money_transfers.confirm = ${confirmStatus} OR ${confirmStatus} is null)

        )
        ORDER BY money_transfers.id DESC
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
        FROM money_transfers
        WHERE id = ${id}
    `
    dbConn.query(sqlGetImage,(err,result)=>{
        if(err) err_service.errorNotification(err,'delete money transfer => get image')
            let image = result[0].pictureUrl
            multer_s.deleteImage('payment/'+image)
            dbConn.query(`DELETE FROM money_transfers WHERE id = ${id}`,(err,result)=>{
                if(err) err_service.errorNotification(err,'delete money transfer')
            })
    })
}
