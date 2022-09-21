const dbConn = require("../database");
const err_service = require('./../../service/err_service')

//***************************************************************************** */
// Package
//***************************************************************************** */
// package Overview
module.exports.packageOverview = (req,res) => {
    sqlGetPackageLength = `
        SELECT 
            COUNT(*) AS packageValue,
            packages.name as packagesName,
            packages.id as packagesId
        FROM users
        INNER JOIN packages ON packages.id = users.packageId
        GROUP BY packages.id
        ORDER BY packages.id ASC;
    `

    sqlGetPackageName = `
        SELECT
            name
        FROM packages
        ORDER BY id ASC;
    `
    let data = {}


    dbConn.query(sqlGetPackageName,(err,result)=>{
        if (err) err_service.errorNotification(err,'package overview => package name ')
        let packageName = []
        for(let i =0 ; i < result.length ; i++){
            packageName.push(result[i].name)
        }
        dbConn.query(sqlGetPackageLength,(err,result)=>{
            if (err) err_service.errorNotification(err,'package overview => package value')
            let packageValue = []
            let packageValuePercent = []
            let packageNameResult = []
            // check package name 
            

            for(let i =0 ; i < result.length ; i++){
                packageValue.push(result[i].packageValue)
                packageNameResult.push(result[i].packagesName)
            }

            for(let i = 0 ; i < packageName.length ; i++){
                if(packageName[i] !== packageNameResult[i]){
                    packageNameResult.splice(i,0,packageName[i])
                    packageValue.splice(i,0,0)
                    i = 0 ;
                }
            }

            let allUserLength = packageValue.reduce((sum, a) => sum + a, 0)
            data.packageValue = packageValue
            
            // find %
            for(let i = 0 ; i < packageName.length ; i++){
                let value = ((packageValue[i]/allUserLength)*100)
                if(i < packageValue.length){
                    packageValuePercent.push(Math.round(value))
                }else{
                    packageValuePercent.push(0)
                }
            }
            data.packageValuePercent = packageValuePercent
            data.packageName = packageName
            console.log('percent',data.packageValuePercent);
            res.send({
                status:true,
                data:data
            })
        })

    })
}

//get all Package
module.exports.getPackageName = (req, res) => {
    dbConn.query("SELECT * FROM packages", (err, result) => {
        if (err) err_service.errorNotification(err,'get all package')
        res.send({
            message: "package list ",
            data: result,
        });
    });
};
//insert Package
module.exports.insertPackage = (req, res) => {
    let packageName = req.body.packageName;

    dbConn.query('SELECT * FROM packages',(err,result)=>{
        if(err) err_service.errorNotification(err,'insert package => check limit')
        if(result.length >= 10){
            res.send({
                status: false,
                msg:'จำนวนแพ็คเกจที่เพิ่มได้ครบ 10 แพ็คเกจแล้ว'
            })
        }else{
            // เช็คชื่อสถานะที่ซ้ำ
            sql_check_packageName =  `SELECT * FROM packages WHERE name = ?`
            dbConn.query(sql_check_packageName,[packageName],(err,result)=>{
                if(err)err_service.errorNotification(err,'add new package => check package name ')
                if(result.length >= 1){
                    res.send({
                        status: false,
                        msg:'ชื่อแพ็คเกจนี้มีอยู่แล้ว !'
                    })
                }else if(packageName === ' ' || packageName === null){
                    res.send({
                        status: false,
                        msg:'ชื่อแพ็คเกจไม่ถูกต้อง !'
                    })
                }else if(result){
                    sql_insert_packageName = `
                        INSERT INTO packages(
                            name,
                            description,
                            price1M, 
                            price3M,
                            price6M,
                            propertyLimit)
                        VALUES (
                            '${packageName}',
                            'เพิ่มรายละเอียดแพ็คเกจ',
                            0,
                            0,
                            0,
                            0)`;
                    dbConn.query(sql_insert_packageName, [packageName], (err, result) => {
                        if (err) err_service.errorNotification(err,'add new package => insert new package')
                        res.send({
                            status: true,
                            msg: "เพิ่มแพ็คเกจใหม่ใหม่เรียบร้อย !",
                        });
                    });
                }
            })
        }
    })

};
//delete delete Package
module.exports.deletePackage = (req,res) =>{
    let packageId = req.params.id
    //ห้ามลบ 4 package หลัก
    if(packageId === '1' || packageId === '2' || packageId === '3' || packageId === '4'){
        res.send({
            status:false,
            msg:'ไม่สามารถลบได้ สถานะนี้ถูกห้ามลบ !'
        })
    }else{
        //เช็คว่ามีคนใช้ package ไหม
        dbConn.query('SELECT * FROM users WHERE packageId = ?',[packageId],(err,result)=>{
            if(err)err_service.errorNotification(err,'delete package => check users use packge')
            console.log(result.length);
            if(result.length > 0){
                res.send({
                    status:false,
                    msg:'มีผู้ใช้งานแพ็คเกจนี้อยู่ จึงไม่สามารถลบได้'
                })
            }else{
                sql_delete_memberStatus = 'DELETE FROM packages WHERE id = ?'
                dbConn.query(sql_delete_memberStatus,[packageId],(err,result)=>{
                    if(err) err_service.errorNotification(err,'delete package')
                    res.send({
                        status:true,
                        msg:'ลบเรียบร้อย'
                    })
                })
            }
        })
    }

}
//update package
module.exports.updatePackage = (req,res) =>{

    let id = req.body.packageID
    let name = req.body.packageName
    let des = req.body.packageDes
    let price1M = req.body.packagePrice1M
    let price3M = req.body.packagePrice3M
    let price6M = req.body.packagePrice6M
    let propLimit = req.body.package_propsLimit

    sql =`
        UPDATE
            packages
        SET name = '${name}' ,
            description = '${des}' ,
            price1M = ${price1M} ,
            price3M = ${price3M} ,
            price6M = ${price6M} ,
            propertyLimit = ${propLimit}
        WHERE id = ${id}

    `
    dbConn.query(sql,(err,result)=>{
        if(err)err_service.errorNotification(err,'update package')
        res.send({
            status:true,
            msg:'อัพเดตสำเร็จ'
        })
    })
}
