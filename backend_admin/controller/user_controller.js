const dbConn = require("../database");
const err_service = require('./../../service/err_service')
const fs = require('fs')
const path = require('path');
const property_ct = require('./../controller/property_controller');
const moneyTransfer_ct = require('./moneyTransfer_controller')
const login_s = require('./../controller/login_controller')
const multer_s = require('./../../service/multer')
const dateAndTime = require('date-and-time')

let date = dateAndTime.format(new Date(),'YYYY/MM/DD HH:mm:ss')

//update user image
function updateImage(image,id){
    dbConn.query('UPDATE users SET pictureUrl = ? WHERE id = ? ',[image,id],(err,result)=>{
        if(err) err_service.errorNotification(err,'update user => delete image')
        console.log('update succc');
    })
}
// user Overview
module.exports.userOverview = (req,res) => {
    sqlAllUser = `
        SELECT
            COUNT(*) AS allUser
        FROM users
    `

    sqlNewUser = `
        SELECT
            COUNT(*) AS newUser
        FROM users
        WHERE
            createdAt >= ADDDATE(CURRENT_TIMESTAMP(), INTERVAL -7 DAY)
            AND createdAt <= CURRENT_TIMESTAMP();
    `

    sqlUserReport =`
        SELECT
            COUNT(*) AS userReport
        FROM user_report_users
        GROUP BY userId
    `

    sqlBannedUser =`
        SELECT 
            COUNT(*) AS bannedUser
        FROM users 
        WHERE displayStatus = 0
    `

    sqlGetAgent =`
        SELECT 
            COUNT(*) AS agentLength
        FROM user_sub_props 
        GROUP BY userId;
    `
    let data = {}
    dbConn.query(sqlAllUser,(err,result)=>{
        if(err)err_service.errorNotification(err,'user Overview => all user')
        data.allUser = result[0].allUser
        dbConn.query(sqlNewUser,(err,result)=>{
            if(err)err_service.errorNotification(err,'user Overview => new user ')
            data.newUser = result[0].newUser
            dbConn.query(sqlUserReport,(err,result)=>{
                if(err)err_service.errorNotification(err,'user Overview => user report  ')
                data.userReport = result.length
                dbConn.query(sqlBannedUser,(err,result)=>{
                    if(err)err_service.errorNotification(err,'user Overview => banned user  ')
                    data.bannedUser = result[0].bannedUser
                    dbConn.query(sqlGetAgent,(err,result)=>{
                        if(err)err_service.errorNotification(err,'user Overview => agent length')
                        let agentData = {}
                        agentData.agentLength = result.length
                        agentData.userLength = data.allUser
                        let agentPercent = ((agentData.agentLength/data.allUser)*100)
                        agentData.agentPercent = Math.round(agentPercent)
                        agentData.userPercent = (100 - agentData.agentPercent)
                        data.agentData = agentData
                        res.send({
                            status:true,
                            data:data
                        })
                    })

                })
            })
        })
    })
}
//seach user
module.exports.seachUser = (req,res) => {
    let name = req.body.name
    let package = req.body.package
    let limit = req.body.limit

    if(name !== null){
        name = `'${name}%'`
    }
    sqlLength = `
    SELECT users.* ,
        users.userId
    FROM users
    INNER JOIN user_account_details ON users.id = user_account_details.userId
    WHERE
    (
        (
            ((CONCAT(users.fname,' ',users.lname) LIKE ${name}) OR ${name} is null)
            OR ((CONCAT(users.fname,'',users.lname) LIKE ${name}) OR ${name} is null)
            OR (users.lname LIKE ${name} OR ${name} is null)
            OR (user_account_details.email LIKE  ${name} OR ${name} is null)
            OR (user_account_details.phone LIKE  ${name} OR ${name} is null)
        ) AND (users.packageId = ${package} OR ${package} is null)

    )
    ORDER BY users.id DESC;`
    sql = `
    SELECT users.* ,
        users.userId AS userIdLine ,
        user_account_details.*,
        packages.name AS packageName
    FROM users
    INNER JOIN user_account_details ON users.id = user_account_details.userId
    INNER JOIN packages ON packages.id = users.packageId 
    WHERE
    (
        (
            ((CONCAT(users.fname,' ',users.lname) LIKE ${name}) OR ${name} is null)
            OR ((CONCAT(users.fname,'',users.lname) LIKE ${name}) OR ${name} is null)
            OR (users.lname LIKE ${name} OR ${name} is null)
            OR (user_account_details.email LIKE  ${name} OR ${name} is null)
            OR (user_account_details.phone LIKE  ${name} OR ${name} is null)
        ) AND (users.packageId = ${package} OR ${package} is null)

    )
    ORDER BY users.id DESC
    LIMIT ${limit.items},${limit.size} ;`

    dbConn.query(sqlLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'seach user length')
        let length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'seach user')
            if(result.length > 0){
                result.imagePath = process.env.IMAGE_PATH_AVATAR
                res.send({
                    status:true,
                    data:result,
                    length:length
                })
            }else{
                res.send({
                    status:false,
                    msg:'no data',
                    data:result
                })
            }
        })
    })
}
//seach user dialog (only name )
module.exports.seachUserDialog = (req,res) => {
    let name = req.body.name
    let limit = req.body.limit
    if(name !== null){
        name = `'${name}%'`
    }
    sqlLength = `
    SELECT users.* ,
        users.userId
    FROM users
    INNER JOIN user_account_details ON users.id = user_account_details.userId
    WHERE
    (
        ((CONCAT(users.fname,'',users.lname) LIKE ${name}) OR ${name} is null)
        OR((CONCAT(users.fname,' ',users.lname) LIKE ${name}) OR ${name} is null)
    )
    ORDER BY users.id DESC;`
    sql = `
    SELECT users.* ,
        users.userId AS userIdLine ,
        user_account_details.*
    FROM users
    INNER JOIN user_account_details ON users.id = user_account_details.userId
    WHERE
    (
        ((CONCAT(users.fname,'',users.lname) LIKE ${name}) OR ${name} is null)
        OR((CONCAT(users.fname,' ',users.lname) LIKE ${name}) OR ${name} is null)
    )
    ORDER BY users.id DESC
    LIMIT ${limit.items},${limit.size};`

    dbConn.query(sqlLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'seach user length')
        let length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'seach user')
            if(result.length > 0){
                result.imagePath = process.env.IMAGE_PATH_AVATAR
                res.send({
                    status:true,
                    data:result,
                    length:length
                })
            }else{
                res.send({
                    status:false,
                    msg:'no data',
                    data:result
                })
            }
        })
    })
}
//search admin
module.exports.seachAdmin = (req,res) => {
    let seachText = req.body.name
    let limit = req.body.limit
    if(seachText !== null){
        seachText = `'${seachText}%'`
    }
    sqlLength = `
    SELECT *
    FROM admin
    WHERE
    (
        ((CONCAT(adminFname,'',adminLname) LIKE ${seachText}) OR ${seachText} is null)
        OR((CONCAT(adminFname,' ',adminLname) LIKE ${seachText}) OR ${seachText} is null)
        OR(adminEmail LIKE  ${seachText} OR ${seachText} is null)
        OR(adminPhone LIKE ${seachText} OR ${seachText} is null)
    )
    `

    sql = `
    SELECT *
    FROM admin
    WHERE
    (
        ((CONCAT(adminFname,'',adminLname) LIKE ${seachText}) OR ${seachText} is null)
        OR((CONCAT(adminFname,' ',adminLname) LIKE ${seachText}) OR ${seachText} is null)
        OR(adminEmail LIKE  ${seachText} OR ${seachText} is null)
        OR(adminPhone LIKE ${seachText} OR ${seachText} is null)
    )
    ORDER BY adminId ASC
    LIMIT ${limit.items},${limit.size};`

    dbConn.query(sqlLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'seach admin length')
        let length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'seach admin')
            if(result.length > 0){
                result.imagePath = process.env.IMAGE_PATH_AVATAR
                res.send({
                    status:true,
                    data:result,
                    length:length
                })
            }else{
                res.send({
                    status:false,
                    msg:'no data',
                    data:result
                })
            }
        })
    })
}
//new user length
module.exports.getNewUserLength= (req,res) => {
    sql=`SELECT COUNT(*)AS newUserLength FROM users
        WHERE createdAt >= ADDDATE(CURRENT_TIMESTAMP(), INTERVAL -7 DAY)
        AND createdAt <= CURRENT_TIMESTAMP();`
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get new user length one week ')
        // console.log(result);
        res.send({
            status:true,
            data:result[0]
        })
    })
}
//get users length
module.exports.getUsersLength = (req,res) => {
    dbConn.query('SELECT COUNT(*)AS usersLength FROM users;',(err,result)=>{
        if(err)err_service.errorNotification(err,'users length')
        res.send({
            data:result
        })
    })
}
//get admin length
module.exports.getAdminLength = (req,res) => {
    // console.log(req.body);
    dbConn.query('SELECT COUNT(*)AS adminLength FROM admin;',(err,result)=>{
        if(err)err_service.errorNotification(err,'admin length')
        res.send({
            data:result
        })
    })
}
//add new user
module.exports.addNewMember = (req,res) => {
    // console.log(req.body);
    userId = req.body.userId
    userName = req.body.userName
    fname = req.body.fname
    lname = req.body.lname
    package_id = req.body.package
    email = req.body.email
    phone = req.body.phone
    organization = req.body.organization
    image = req.body.gallery[0]


    sqlInsertUser = `
        INSERT INTO users(
                        userId,
                        displayName,
                        fname,
                        lname,
                        pictureUrl,
                        createdAt,
                        updatedAt,
                        packageId,
                        displayStatus,
                        roleId,
                        subscriptionPeriodId,
                        packageExpire)
                VALUES( '${userId}',
                        '${userName}',
                        '${fname}',
                        '${lname}',
                        '${image}',
                        '${date}',
                        '${date}',
                        '${package_id}',
                        1,
                        2,
                        1,
                        ADDDATE(CURRENT_TIMESTAMP(),
                        INTERVAL +30 DAY))
    `

    dbConn.query(sqlInsertUser,(err,result)=>{
        if(err)err_service.errorNotification(err,'add new member => users table')
        dbConn.query('SELECT id FROM users WHERE pictureUrl =? ',[image],(err,result)=>{
            if(err)err_service.errorNotification(err,'add new member => get id')
            id = result[0].id
            sqlInsertUserDetail = `
                INSERT INTO user_account_details(
                    userId,
                    email,
                    phone,
                    organization)
                VALUES(
                    '${id}',
                    '${email}',
                    '${phone}',
                    '${organization}')
            `
            dbConn.query(sqlInsertUserDetail,(err,result)=>{
                if(err)err_service.errorNotification(err,'add new member => user_account_details table')
                res.send({
                    status:true,
                    msg:'insert success'
                })
            })
        })
    })
}
//update user
module.exports.updateUser = (req,res) => {
    id = req.body.id
    tokenLindID = req.body.tokenLindID
    userName = req.body.userName
    fname = req.body.fname
    lname = req.body.lname
    package_id = req.body.package
    email = req.body.email
    phone = req.body.phone
    organization = req.body.organization
    image = req.body.gallery[0]
    // console.log(req.body);
    if(req.body.gallery.length > 0 ){
        dbConn.query('SELECT pictureUrl FROM users WHERE id = ?',[id],(err,result)=>{
            if(err) err_service.errorNotification(err,'get old picture name ')
            if(result[0].pictureUrl !== ""){
                let oldImage = result[0].pictureUrl
                fs.unlink(path.resolve('public/images/avatar/'+oldImage),(err)=>{
                    if(err) err_service.errorNotification(err,'update user => delete image ') ;
                    updateImage(image,id)
                })
            }else if(result[0].pictureUrl === ""){
                updateImage(image,id)
            }
        })
    }
    //get id from userDetail
    dbConn.query('SELECT id FROM user_account_details WHERE userId = ?',[id],(err,result)=>{
        if(err) err_service.errorNotification(err,'update user => get id user detail')
        userDetailId = result[0].id

        //update users
        sql_update_main = `
            UPDATE users
            SET displayName = '${userName}' ,
                fname = '${fname}' ,
                lname = '${lname}' ,
                packageId = '${package_id}' ,
                updatedAt = '${date}'
            WHERE id = '${id}'
            `
            console.log(date);

        dbConn.query(sql_update_main,(err,result)=>{
            if(err) err_service.errorNotification(err,'update user => main table')
            //update useretail
            sql_update_user = `
                UPDATE user_account_details
                SET email = '${email}' ,
                    phone = '${phone}' ,
                    organization = '${organization}'
                WHERE id = '${userDetailId}'
                `
            dbConn.query(sql_update_user,(err,result=>{
                if(err) err_service.errorNotification(err,'update user => sub table')
                res.send({
                    status:true,
                    msg:'บันทึกสำเร็จ'
                })
            }))
        })
    })
}
//update admin detail
module.exports.updateAdminDetail = (req,res) =>{
    const id = req.body.id;
    const username = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const phone = req.body.phone;
    const address = req.body.address;
    let image = req.body.gallery[0];
    // console.log(req.body);
    //get old name image
    dbConn.query('SELECT pictureUrl FROM admin WHERE adminId = ?',[id],(err,result)=>{
        if(err)err_service.errorNotification(err,'update admin get old name image')
        if(req.body.gallery[0]){
            if(result[0].pictureUrl !== ''){
                multer_s.deleteImage('avatar/'+result[0].pictureUrl)
            }
        }else{
            image = result[0].pictureUrl
        }
        //update
        dbConn.query('UPDATE admin SET adminUsername = ? , adminEmail = ? , adminFname = ? , adminLname = ? , adminPhone = ? , adminAddress = ? , pictureUrl =? WHERE adminId = ?  ',
        [username,email,fname,lname,phone,address,image,id],(err,result)=>{
            if(err)err_service.errorNotification(err,'update admin')
            if(password !== 'undefined'){
                console.log('new pass');
                login_s.newPasswordAdmin(password,id)
            }
            res.send({
                status:true,
                msg:'update success '
            })
        })
    })
}
//get all admin
module.exports.getAllAdminList = async (req, res) => {
    console.log(req.body);
    let sqlGetAdminList =`
        SELECT 
            admin.* ,
            roles.role_name 
        FROM admin
        INNER JOIN roles ON admin.role_id = roles.roleId
        ORDER BY admin.adminId ASC 
        LIMIT ${req.body.items},${req.body.size};
        `
    dbConn.query(sqlGetAdminList,(err, result) => {
        if (err) err_service.errorNotification(err,'get all admin data')
        res.send({
            message: "admin list ",
            data: result,
            imagePath: process.env.IMAGE_PATH_AVATAR
        });
    });
};
//get admin detail By id
module.exports.getAdminDetail = (req,res) => {
    dbConn.query('SELECT * FROM admin WHERE adminId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get admin detail')
        res.send({
            status:true,
            msg:'get admin detail success',
            data:result,
            imagePath:process.env.IMAGE_PATH_AVATAR
        })
    })
}
//get user detail By Id
module.exports.getUserById = async (req, res) => {
    let data = {}
    const sql_main = `SELECT users.* , users.userId AS tokenLindID , user_account_details.* from users
                        INNER JOIN user_account_details ON users.id = user_account_details.userId
                        WHERE users.id = ?;`
    dbConn.query(sql_main,[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get user by id => main ')
        data.info = result
    })

    //compareList
    dbConn.query('SELECT * FROM user_compares WHERE userId = ? ',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get user by id => user compare props')
        let compareList=[]
        for(let i = 0 ; i < result.length ; i++){
            compareList.push(result[i].propertyId)
        }
        data.compareList = compareList
    })

    //favoritesList
    dbConn.query('SELECT * FROM user_favorites WHERE userId = ? ',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get user by id => user favorite props')
        let favoritesList =[]
        for(let i = 0 ; i < result.length ; i++){
            favoritesList.push(result[i].propertyId)
        }
        data.favoritesList = favoritesList

        res.send({
            status:true,
            data:data,
            imagePath:process.env.IMAGE_PATH_AVATAR
        })
    })

}
//get all users
module.exports.getAlluserList = (req, res) => {
    console.log(req.body);
    const sql = `
        SELECT 
            users.* , 
            users.userId AS userIdLine ,
            user_account_details.* ,
            packages.name AS packageName
        FROM users
        INNER JOIN user_account_details ON users.id = user_account_details.userId
        INNER JOIN packages ON packages.id = users.packageId 
        ORDER BY users.id DESC LIMIT ${req.body.items},${req.body.size};`
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get all user')
        res.send({
            status:true,
            msg:'get all users success',
            data:result,
            imagePath:process.env.IMAGE_PATH_AVATAR
        })
    })
}
//get user for add property
module.exports.getAllUserForPropertySelect = (req,res)=>{
    const sql = `SELECT users.* , users.userId AS userIdLine ,
        user_account_details.* FROM users
        INNER JOIN user_account_details ON users.id = user_account_details.userId
        ORDER BY users.id DESC;`
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get all user')
        res.send({
            status:true,
            msg:'get all users success',
            data:result,
            imagePath:process.env.IMAGE_PATH_AVATAR
        })
    })
}
//delete admin
module.exports.deleteAdmin = (req,res) => {
    dbConn.query('SELECT pictureUrl FROM admin WHERE adminId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'delete admin => get picture name')
        multer_s.deleteImage('avatar/'+result[0].pictureUrl)
        dbConn.query('DELETE FROM admin WHERE adminId = ?',[req.params.id],(err,result)=>{
            if(err) err_service.errorNotification(err,'delete Admin => delelte ')
            res.send({
                status:true,
                msg:'ลบสำเร็จ'
            })
        })
    })

}
//delete user By id
module.exports.deleteUser = (req,res) => {

    sqlGetPictureUrl =`
        SELECT
            pictureUrl
        FROM users
        WHERE id = ${req.params.id};
    `

    sqlGetPropertyId =`
        SELECT
            id
        FROM user_sub_props
        WHERE userId = ${req.params.id};
    `

    sqlDeleteUser =`
        DELETE FROM users
        WHERE id = ${req.params.id};
    `

    sqlGetPaymentId =`
        SELECT
            id
        FROM money_transfers
        WHERE userId = ${req.params.id};
    `

    dbConn.query(sqlGetPictureUrl,(err,result)=>{
        if(err) err_service.errorNotification(err,'delete user => get picture name ')
        let picture =  result[0].pictureUrl
        // ลบ picture user
        if(picture.length <= 20 ){
            multer_s.deleteImage('avatar/'+picture)
        }
        dbConn.query(sqlGetPropertyId,(err,result)=>{
            if(err) err_service.errorNotification(err,'delete user => get property id ')
            let propertyId = result

            if(propertyId.length > 0){
                for(let i =  0 ; i < propertyId.length ; i++){
                    //ลบ property user
                    property_ct.deletePropertyByUser(propertyId[i].id)
                }
            }

            dbConn.query(sqlGetPaymentId,(err,result)=>{
                console.log(result);
                let paymentId = result
                if(paymentId.length > 0){
                    for(let i =  0 ; i < paymentId.length ; i++){
                        //ลบ payment
                        moneyTransfer_ct.deleteMoneyTransferByDeleteUser(paymentId[i].id)
                    }
                }
                dbConn.query(sqlDeleteUser,(err,result)=>{
                    if(err) err_service.errorNotification(err,'delete user ')
                    res.send({
                        status:true,
                        msg:'ลบสำเร็จ'
                    })
                })
            })
        })

    })

}
//delete favorite props list
module.exports.deleteFavProperty = (req,res)=>{
    dbConn.query('DELETE FROM user_favorites WHERE id = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'delete user_favorites ')
        res.send({
            status:true,
            msg:'ลบสำเร็จ'
        })
    })
}
//delete Compare props list
module.exports.deleteCompareProperty = (req,res)=>{
    dbConn.query('DELETE FROM user_compares WHERE id = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'delete user_compares ')
        res.send({
            status:true,
            msg:'ลบสำเร็จ'
        })
    })
}

//change status user (banned)
module.exports.changeStatusUser = (req,res) => {
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

