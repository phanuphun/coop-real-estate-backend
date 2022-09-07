const dbConn = require("../database");
const authToken = require('./../service/auth_service')
const err_service = require('./../service/err_service')

//***************************************************************************** */
// Package
//***************************************************************************** */
//get all Package
module.exports.getPackageName = (req, res) => {
    dbConn.query("SELECT * FROM package", (err, result) => {
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

    dbConn.query('SELECT * FROM package',(err,result)=>{
        if(err) err_service.errorNotification(err,'insert package => check limit')
        if(result.length >= 10){
            res.send({
                status: false,
                msg:'จำนวนแพ็คเกจที่เพิ่มได้ครบ 10 แพ็คเกจแล้ว'
            })
        }else{
            // เช็คชื่อสถานะที่ซ้ำ
            sql_check_packageName =  `SELECT * FROM package WHERE name = ?`
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
                    sql_insert_packageName = `INSERT INTO package(name) VALUES (?)`;
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
                sql_delete_memberStatus = 'DELETE FROM package WHERE id = ?'
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
    let price2M = req.body.packagePrice2M
    let price3M = req.body.packagePrice3M
    let propLimit = req.body.package_propsLimit

    sql =`
        UPDATE
            package
        SET name = '${name}' ,
            description = '${des}' ,
            price1M = ${price1M} ,
            price2M = ${price2M} ,
            price3M = ${price3M} ,
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
