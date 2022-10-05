const dbConn = require("./../database");
const err_service = require('./../../service/err_service')
const multer_s = require('./../../service/multer');
require('dotenv').config()
const dateAndTime = require('date-and-time');
const { stat } = require("fs");

let date = dateAndTime.format(new Date(),'YYYY/MM/DD HH:mm:ss')

// get property data overview
module.exports.propertyOverview = (req,res)=>{
    sqlGetPupularType =`
        SELECT
            COUNT(user_sub_props.propType) AS propertyTypeLength ,
            property_types.name_th AS propertyType
        FROM user_sub_props
        INNER JOIN property_types ON property_types.id = user_sub_props.propType
        GROUP BY property_types.id
        ORDER BY propertyTypeLength DESC;
    `

    sqlAllPropertyLength =`
        SELECT
            COUNT(*) AS allPropertylength
        FROM user_sub_props;
    `

    sqlPropertyReport =`
            SELECT
            COUNT(*) AS propertyReport
        FROM user_report_properties
        GROUP BY propertyId
    `

    sqlNewProperty =`
        SELECT
            COUNT(*) AS newPropertyLength
        FROM user_sub_props
        WHERE
            createdAt >= ADDDATE(CURRENT_TIMESTAMP(), INTERVAL -7 DAY)
            AND createdAt <= CURRENT_TIMESTAMP();
    `

    sqlPropertyPurposeSaleCount = `
        SELECT
            property_purposes.name_th AS propertyPurposeName ,
            COUNT(user_sub_props.id) AS propertyCountSale 
        FROM user_sub_props 
        INNER JOIN property_purposes ON property_purposes.id = user_sub_props.propFor
        WHERE  user_sub_props.propFor = 1 
                OR
               user_sub_props.propFor = 3;
    `
    sqlPropertyPurposeRentCount = `
        SELECT
            property_purposes.name_th AS propertyPurposeName ,
            COUNT(user_sub_props.id) AS propertyCountRent 
        FROM user_sub_props 
        INNER JOIN property_purposes ON property_purposes.id = user_sub_props.propFor
        WHERE  user_sub_props.propFor = 2 
                OR
               user_sub_props.propFor = 3;
    `

    let data = {}
    dbConn.query(sqlAllPropertyLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'get property data overview => get all props length ')
        data.allPropertylength = result[0].allPropertylength
        dbConn.query(sqlGetPupularType,(err,result)=>{
            if(err)err_service.errorNotification(err,'get property data overview => get propts type ')
            data.propertyType = result[0].propertyType
            dbConn.query(sqlPropertyReport,(err,result)=>{
                if(err)err_service.errorNotification(err,'get property data overview => get propt report')
                data.propertyReport = result.length
                dbConn.query(sqlNewProperty,(err,result)=>{
                    if(err)err_service.errorNotification(err,'get property data overview => get new property')
                    data.newPropertyLength = result[0].newPropertyLength
                    dbConn.query(sqlPropertyPurposeSaleCount,(err,result)=>{
                        if(err)err_service.errorNotification(err,'get property data overview => get  property purpose sale')
                        let porposeLength = []
                        porposeLength.push(result[0].propertyCountSale)
                        dbConn.query(sqlPropertyPurposeRentCount,(err,result)=>{
                            if(err)err_service.errorNotification(err,'get property data overview => get  property purpose rent')
                            porposeLength.push(result[0].propertyCountRent)
                            data.porposeLength = porposeLength
                            console.log(data);
                            res.send({
                                status:true,
                                data:data
                            })
                        })

                    })

                })
            })
        })
    })
}
//search property 
module.exports.searchProperty = (req,res) => {
    // console.log(req.body);
    let title = req.body.title
    let type = req.body.type
    let purpose = req.body.purpose
    let province = req.body.province
    let districts = req.body.districts
    let subDistrict = req.body.subDistrict
    let saleStatus = req.body.saleStatus
    let limit = req.body.limit
    // SQL Set String
    // title set sql value
    if(title !== null ){
        title = `'${title}%'`
    }
    sqlLength = `
    SELECT
        user_sub_props.id
    FROM user_sub_props
    INNER JOIN user_sub_prop_galleries ON user_sub_props.id = user_sub_prop_galleries.propertyId
    INNER JOIN property_purposes ON user_sub_props.propFor = property_purposes.id
    INNER JOIN property_types ON user_sub_props.propType = property_types.id
    INNER JOIN user_sub_prop_additionals ON user_sub_props.id = user_sub_prop_additionals.propertyId
    INNER JOIN subdistricts ON user_sub_props.addressId = subdistricts.id
    INNER JOIN districts ON districts.id = subdistricts.DistrictId
    INNER JOIN provinces ON provinces.id = districts.ProvinceId
    WHERE
    (
        (user_sub_props.title LIKE ${title} OR ${title} is null)
        AND (user_sub_props.propType = '${type}' OR ${type} is null)
        AND (user_sub_props.propFor = ${purpose}  OR ${purpose} is null)
        AND (provinces.id = ${province} OR ${province} is null)
        AND (districts.id = ${districts} OR ${districts} is null)
        AND (subdistricts.id = ${subDistrict} OR ${subDistrict} is null)
        AND (user_sub_props.saleStatus = ${saleStatus} OR ${saleStatus} is null) 

    )
    GROUP BY user_sub_prop_galleries.propertyId
    `
    sql = `
    SELECT 
        user_sub_props.*, 
        property_purposes.name_th ,
        property_types.name_th AS propertyType,
        user_sub_prop_additionals.bedrooms,
        user_sub_prop_additionals.bedrooms, 
        user_sub_prop_additionals.garages,
        user_sub_prop_additionals.area , 
        user_sub_prop_additionals.floor, 
        user_sub_prop_additionals.yearBuilt,
        user_sub_prop_galleries.path AS image,
        subdistricts.name_th AS subDistricts,
        districts.name_th AS districts,
        provinces.name_th AS province,
        users.fname AS userFname,
        users.lname AS userLname
    FROM user_sub_props
    INNER JOIN user_sub_prop_galleries ON user_sub_props.id = user_sub_prop_galleries.propertyId
    INNER JOIN property_purposes ON user_sub_props.propFor = property_purposes.id
    INNER JOIN property_types ON user_sub_props.propType = property_types.id
    INNER JOIN user_sub_prop_additionals ON user_sub_props.id = user_sub_prop_additionals.propertyId
    INNER JOIN subdistricts ON subdistricts.id = user_sub_props.addressId
    INNER JOIN districts ON districts.id = subdistricts.DistrictId
    INNER JOIN provinces ON provinces.id = districts.ProvinceId
    INNER JOIN users ON users.id = user_sub_props.userId
    WHERE
    (
        (user_sub_props.title LIKE ${title} OR ${title} is null)
        AND (user_sub_props.propType = '${type}' OR ${type} is null)
        AND (user_sub_props.propFor = ${purpose}  OR ${purpose} is null)
        AND (provinces.id = ${province} OR ${province} is null)
        AND (districts.id = ${districts} OR ${districts} is null)
        AND (subdistricts.id = ${subDistrict} OR ${subDistrict} is null)
        AND (user_sub_props.saleStatus = ${saleStatus} OR ${saleStatus} is null) 
    )
    GROUP BY user_sub_prop_galleries.propertyId
    ORDER BY user_sub_props.id DESC
    LIMIT ${limit.items},${limit.size};
    `

    // console.log(sql);
    dbConn.query(sqlLength,(err,result)=>{
        if(err)err_service.errorNotification(err,'search property table get length')
        let length = result.length
        dbConn.query(sql,(err,result)=>{
            if(err)err_service.errorNotification(err,'search property table')
            if(result.length > 0){
                result[0].imagePath = process.env.IMAGE_PATH_PROPERTY
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
//add new Property
module.exports.addNewProperty = (req,res)=>{
    userId = req.body.userId
    title = req.body.title
    desc = req.body.desc
    priceSale = req.body.priceSale
    priceRent = req.body.priceRent
    propsPP_sl = req.body.propsPP_sl
    propsType_sl = req.body.propsType_sl
    Subdistricts_sl = req.body.Subdistricts_sl
    houseNO = req.body.houseNO
    zipcode = req.body.zipcode
    floor = req.body.floor
    bedrooms = req.body.bedrooms
    bathrooms = req.body.bathrooms
    garages = req.body.garages
    yearBuilt = req.body.yearBuilt
    area = req.body.area
    lat = req.body.lat
    lng = req.body.lng

    if(req.body.featuresList){
        featuresList = req.body.featuresList
    }
    if(priceSale === undefined || priceSale === 'undefined' || priceSale === '' || priceSale === null){
        priceSale = 0 
    }
    if(priceRent === undefined || priceRent === 'undefined' || priceRent === '' || priceRent === null){
        priceRent = 0 
    }
    gallery = req.body.gallery

    sqlInsertSubProps =`
        INSERT INTO user_sub_props(
            userId,
            title,
            description,
            propFor,
            priceSale,
            priceRent,
            propType,
            lat,
            lng,
            houseNo,
            addressId,
            saleStatus,
            createdAt,
            updatedAt,
            displayStatus) 
        VALUES(
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?);
    `
    valueInsertSubprop = [
        userId,
        title,
        desc,
        propsPP_sl,
        priceSale,
        priceRent,
        propsType_sl,
        lat,
        lng,
        houseNO,
        Subdistricts_sl,
        0,
        date,
        date,
        1
    ]

    sqlGetPropByid =`
        SELECT 
            id 
        FROM user_sub_props 
        ORDER BY id DESC 
        LIMIT 1;
    `

    sqlGetRoomsId =`
        SELECT 
            id 
        FROM user_sub_prop_additionals 
        ORDER BY id DESC 
        LIMIT 1;
    `
    //insert prop main
    dbConn.query(sqlInsertSubProps,valueInsertSubprop,(err,result)=>{
        if(err)err_service.errorNotification(err,'add new prop => main table')
        //get prop id
        dbConn.query(sqlGetPropByid,(err,result)=>{
            if(err)err_service.errorNotification(err,'add new prop => get prop id')
            propertyId = result[0].id
            sqlInsertRooms =`
            INSERT INTO user_sub_prop_additionals(
                floor,
                bedrooms,
                bathrooms,
                garages,
                yearBuilt,
                area,
                propertyId)
            VALUE (
                ${floor},
                ${bedrooms},
                ${bathrooms},
                ${garages},
                ${yearBuilt},
                ${area},
                ${propertyId})
            `

            //insert additionals (rooms)
            dbConn.query(sqlInsertRooms,(err,result)=>{
                if(err)err_service.errorNotification(err,'add new props => insert additional(rooms)')
                //get additional Id
                dbConn.query(sqlGetRoomsId,(err,result)=>{
                    if(err)err_service.errorNotification(err,'add new props => get additional(rooms) Id')
                    additionalId = result[0].id
                    //add feature Id
                    if(req.body.featuresList){
                        for(let i = 0 ; i < featuresList.length ;i++){
                            chcekFeatures(additionalId,featuresList[i])
                        }
                    }else{
                        //no feature => add null
                        chcekFeatures(additionalId)
                    }

                    //add images
                    for(let i = 0 ; i < gallery.length ;i++){
                        insertPropImage(gallery[i],propertyId)
                    }
                    res.send({
                        status:true,
                        msg:'insert success'
                    })
                })
            })
        })
    })
}
//get new property length
module.exports.getNewPropertyLength = (req,res) => {
    sql = `
        SELECT 
            COUNT(*) AS newPropertyLength 
        FROM user_sub_props
        WHERE createdAt >= ADDDATE(CURRENT_TIMESTAMP(), INTERVAL -7 DAY)
              AND createdAt <= CURRENT_TIMESTAMP();`
    dbConn.query(sql,(err,result)=>{
        if(err) err_service.errorNotification(err,'get new property length one week ')
        res.send({
            status:true,
            data:result[0]
        })
    })
}
//get property length
module.exports.getPropertyLength = (req,res) => {
    dbConn.query('SELECT COUNT(*)AS propertyLength FROM user_sub_props;',(err,result)=>{
        if(err)err_service.errorNotification(err,'props length')
        res.send({
            data:result
        })
    })
}
//get all property
module.exports.getAllPropertyList = (req, res) => {
    console.log(req.body);
    sql = ` SELECT 
                user_sub_props.*, 
                property_purposes.name_th ,
                property_types.name_th AS propertyType,
                user_sub_prop_additionals.bedrooms,
                user_sub_prop_additionals.bedrooms, 
                user_sub_prop_additionals.garages,
                user_sub_prop_additionals.area , 
                user_sub_prop_additionals.floor, 
                user_sub_prop_additionals.yearBuilt,
                user_sub_prop_galleries.path AS image,
                subdistricts.name_th AS subDistricts,
                districts.name_th AS districts,
                provinces.name_th AS province,
                users.fname AS userFname,
                users.lname AS userLname
            FROM user_sub_props
            INNER JOIN user_sub_prop_galleries ON user_sub_props.id = user_sub_prop_galleries.propertyId
            INNER JOIN property_purposes ON user_sub_props.propFor = property_purposes.id
            INNER JOIN property_types ON user_sub_props.propType = property_types.id
            INNER JOIN user_sub_prop_additionals ON user_sub_props.id = user_sub_prop_additionals.propertyId
            INNER JOIN subdistricts ON subdistricts.id = user_sub_props.addressId
            INNER JOIN districts ON districts.id = subdistricts.DistrictId
            INNER JOIN provinces ON provinces.id = districts.ProvinceId
            INNER JOIN users ON users.id = user_sub_props.userId
            GROUP BY user_sub_prop_galleries.propertyId 
            ORDER BY id DESC
            LIMIT ${req.body.items},${req.body.size}; `
        dbConn.query(sql,(err, result) => {
            if (err) err_service.errorNotification(err,'get all property')
            if(result.length > 0){
                result[0].imagePath = process.env.IMAGE_PATH_PROPERTY
                res.send({
                    status:true,
                    message: "property list ",
                    data: result,
                });
            }else{
                res.send({
                    status:false,
                    message: "no data",
                    data: result,
                });
            }

        });
};
//get property By ID
module.exports.getPropertyByID = (req, res) => {
    // keyword for qry
    let id_user_props = req.params.id; //id บ้านหลังนั้นๆ
    let user_sub_prop_additionalID; //รหัสตารางย่อยที่เก็บรายชื่อห้องไว้
    let subDistrictsID; //รหัสตำบล
    let DistrictsID; //รหัสอำเภอ
    let ProvinceID; //รหัสจังหวัด
    let property_ppID; //ประเภทอสังหาริมทรัพย์

    //data
    let realData = {
        user:{},
        info:{},
        address:{},
        additional:{},
        rooms:{},
    };

    // qry เอาข้อมูลจากตาราง user_sub_props หลักก่อน
    sql_user_sub_props = `SELECT user_sub_props.*,
    property_purposes.name_th,
    property_types.name_th,
    user_sub_prop_additionals.bedrooms,
    user_sub_prop_additionals.bathrooms,
    user_sub_prop_additionals.garages,
    user_sub_prop_additionals.area ,
    user_sub_prop_additionals.floor,
    user_sub_prop_additionals.yearBuilt
    From user_sub_props
    INNER JOIN property_purposes ON user_sub_props.propFor = property_purposes.id
    INNER JOIN property_types ON user_sub_props.propType = property_types.id
    INNER JOIN user_sub_prop_additionals ON user_sub_props.id = user_sub_prop_additionals.propertyId
    WHERE user_sub_props.id = ?;`

    dbConn.query(sql_user_sub_props, [id_user_props], (err, result) => {
    if (err) err_service.errorNotification(err,'get property by id => query main property detail')
    if (result.length === 1) {

        subDistrictsID = result[0].addressId;
        user_sub_prop_additionalID = result[0].additionalId; //รหัสตารางย่อยที่เก็บรายชื่อห้องไว้
        property_ppID = result[0].propFor; // รหัสประเภทอสังหาริมทรัพย์
        
        //user
        realData.user.userId  = result[0].userId;

        //info
        realData.info.title = result[0].title;
        realData.info.description = result[0].description;
        realData.info.house_type = result[0].name_th;
        realData.info.house_type_ID = result[0].propType;
        realData.info.priceSale = result[0].priceSale;
        realData.info.priceRent = result[0].priceRent;
        realData.info.saleStatus = result[0].saleStatus;

        //address
        realData.address.houseNo = result[0].houseNo;
        realData.address.ID_subDistricts = subDistrictsID;

        //additional
        // realData.additional.gallery = result[0].gallery;
        realData.additional.lat = result[0].lat;
        realData.additional.lng = result[0].lng;
        realData.additional.createdAt = result[0].createdAt;
        realData.additional.updatedAt = result[0].updatedAt;
        realData.additional.displayStatus = result[0].displayStatus;

        //rooms
        realData.rooms.floor = result[0].floor;
        realData.rooms.area = result[0].area;
        realData.rooms.bedrooms = result[0].bedrooms;
        realData.rooms.bathrooms = result[0].bathrooms;
        realData.rooms.yearBuilt = result[0].yearBuilt;
        realData.rooms.garages = result[0].garages;

        //username
        dbConn.query('SELECT * FROM users WHERE id = ?',[result[0].userId],(err,result)=>{
            realData.user.userName = result[0].displayName;
            realData.user.userFname = result[0].fname;
            realData.user.userLname = result[0].lname;
            //image
            dbConn.query('SELECT * FROM user_sub_prop_galleries WHERE propertyId = ?',[req.params.id],(err,result)=>{
                if(err) err_service.errorNotification(err,'get images by property id ')
                realData.additional.imagePath = process.env.IMAGE_PATH_PROPERTY
                realData.additional.images = result

                // qry ประเภทอสังหา
                sql_props_pp = "SELECT * FROM `property_purposes` WHERE id = ?;";
                dbConn.query(sql_props_pp, [property_ppID], (err, result) => {
                    if (err) err_service.errorNotification(err,'get property by id => query property purpose')
                    if (result.length === 1 ) {

                        realData.info.props_pp = result[0].name_th // ประเภทอสังหา เช่น ขาย เช่า
                        realData.info.props_pp_ID = property_ppID

                        // qry เอาที่อยู่จากรหัสตำบล
                        // qry เอาชื่อตำบล
                        sql_subdistricts = 'SELECT * FROM `subdistricts` WHERE id = ?;'
                        dbConn.query(sql_subdistricts,[subDistrictsID], (err,result)=>{
                            if(err) err_service.errorNotification(err,'get property by id => get subdistricts ')
                            if(result.length === 1){
                                DistrictsID = result[0].DistrictId
                                realData.address.subDistricts =  result[0].name_th
                                realData.address.zip_code = result[0].zip_code
                                realData.address.ID_District = result[0].DistrictId
                                    // qry เอาข้อมูลอำเภอจาก id อำเภอ
                                    sql_districts = 'SELECT * FROM `districts` WHERE id = ?;'
                                    dbConn.query(sql_districts,[DistrictsID], (err,result)=>{
                                        if(err) err_service.errorNotification(err,'get property by id => get districts')
                                        if(result.length === 1 ){
                                            ProvinceID = result[0].ProvinceId
                                            realData.address.districts =  result[0].name_th
                                            realData.address.ID_Province =  result[0].ProvinceId

                                            // qry เอาข้อมูลจังหวัดจาก id จังหวัด
                                            sql_province = 'SELECT * FROM `provinces` WHERE id = ?;'
                                            dbConn.query(sql_province,[ProvinceID],  (err,result)=>{
                                                if(err) err_service.errorNotification(err,'get property by id => get provices')
                                                if(result.length === 1){
                                                    realData.address.province =  result[0].name_th
                                                }
                                                // get additional id
                                                dbConn.query('SELECT id FROM user_sub_prop_additionals WHERE propertyId=?',[id_user_props],(err,result)=>{
                                                    if(err)err_service.errorNotification(err,'get property id => get addtional id')
                                                    user_sub_prop_additionalID = result[0].id
                                                    // feature
                                                    sql_additional_features = 'SELECT * FROM `user_sub_prop_additional_features` WHERE additionalId = ?'
                                                    dbConn.query(sql_additional_features,[user_sub_prop_additionalID],(err,result)=>{
                                                        if(err) err_service.errorNotification(err,'get property by id => get features id')

                                                        if(result.length >= 1){

                                                            //Feature
                                                            let ft = [] // เก็บรหัส feature ไว้
                                                            let ft_name =[] //เก็บชื่อ frature เป็น arr
                                                            let ft_name_oj ={} //เก็บชื่อ frature เป็น oj

                                                            realData.additional.futureID = ft
                                                            //ใส่ id feature ลงใน arr ft
                                                            for(let i=0;i<result.length;i++){
                                                                ft.push(result[i].featuresId);
                                                            }

                                                            if(ft[0] != null){
                                                                // qry เอารายชื่อ feature
                                                                sql_features = 'SELECT * FROM `property_additional_features` WHERE id = ?'
                                                                for(let i=0;i<ft.length;i++){
                                                                    dbConn.query(sql_features,[ft[i]],(err,result)=>{
                                                                        if(err) err_service(err,'get property by id => get features name')
                                                                        if(result){
                                                                            ft_name.push(result[0].name_th)
                                                                        }
                                                                    })
                                                                    // ถ้า i+1 = จำนวนให้ res.send data ออกไป
                                                                    if(i+1 == ft.length){
                                                                        ft_name_oj = Object.assign({},ft_name)
                                                                        realData.features = ft_name_oj
                                                                        res.send({
                                                                            status:true,
                                                                            realData:realData,
                                                                            imagePath:process.env.IMAGE_PATH_PROPERTY
                                                                        })
                                                                    }
                                                                }
                                                            }else{
                                                                realData.features = null
                                                                res.send({
                                                                    status:true,
                                                                    realData:realData,
                                                                    imagePath:process.env.IMAGE_PATH_PROPERTY
                                                                })
                                                            }

                                                        }else{
                                                            realData.features = null
                                                            res.send({
                                                                status:true,
                                                                realData:realData,
                                                                imagePath:process.env.IMAGE_PATH_PROPERTY
                                                            })
                                                        }
                                                    })
                                                })

                                            })
                                        }
                                })
                            }
                        })

                    }
                });

            })
        })



    }
    });
};
//get property List By user ID
module.exports.getPropertyListByUserId = (req,res) => {
    sql=`SELECT 
            user_sub_props.* , 
            user_sub_prop_galleries.path 
        FROM user_sub_props
        INNER JOIN user_sub_prop_galleries ON user_sub_prop_galleries.propertyId = user_sub_props.id
        WHERE user_sub_props.userId = ? 
        GROUP BY user_sub_prop_galleries.propertyId;`
    dbConn.query(sql,[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get property List By user ID')
        res.send({
            status:true,
            data:result,
            host:process.env.IMAGE_PATH_PROPERTY
        })
    })
}
//get favorite property list by user id
module.exports.getFavoriteProperty = (req,res) => {
    sql =`
        SELECT 
            user_favorites.id AS FavId, 
            user_sub_props.* , 
            user_sub_prop_galleries.path 
        FROM user_sub_props
        INNER JOIN user_favorites ON user_sub_props.id = user_favorites.propertyId
        INNER JOIN user_sub_prop_galleries ON user_sub_prop_galleries.propertyId = user_sub_props.id
        WHERE user_favorites.userId = ?
        GROUP BY user_favorites.propertyId ORDER BY user_favorites.id DESC`

    dbConn.query(sql,[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get favorite property')
        res.send({
            status:true,
            host:process.env.IMAGE_PATH_PROPERTY,
            data:result
        })
    })
}
//get compare property list by user id
module.exports.getCompareProperty = (req,res) => {
    sql =`
        SELECT 
            user_compares.id AS CompareId, 
            user_sub_props.* , 
            user_sub_prop_galleries.path 
        FROM user_sub_props
        INNER JOIN user_compares ON user_sub_props.id = user_compares.propertyId
        INNER JOIN user_sub_prop_galleries ON user_sub_props.id = user_sub_prop_galleries.propertyId
        WHERE user_compares.userId = ?
        GROUP BY user_compares.propertyId ORDER BY user_compares.id DESC`
    dbConn.query(sql,[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get compare property')
        res.send({
            status:true,
            host:process.env.IMAGE_PATH_PROPERTY,
            data:result
        })
    })
}
//delete image property By image id
module.exports.deletePropertyImage = (req,res) => {
    dbConn.query('SELECT * FROM  user_sub_prop_galleries WHERE id = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'deletePropertyImage => check image name') ;
        if(result.length === 1){
            imageName = result[0].path
            multer_s.deleteImage('properties/'+imageName)
            // fs.unlink(path.resolve('public/images/'+imageName),(err)=>{
                // if(err) err_service.errorNotification(err,'deletePropertyImage => fs ') ;

                dbConn.query('DELETE FROM user_sub_prop_galleries WHERE id = ?',[req.params.id],(err,result)=>{
                    if(err) err_service.errorNotification(err,'delete image property')
                    res.send({
                        status:true,
                        msg:'ลบภาพสำเร็จแล้ว!'
                    })
                })
            // })
        }else{
            res.send({
                status:false,
                msg:'ไม่มีภาพนี้อยู่ในฐานข้อมูล'
            })
        }
    })
}
//get images By property ID
module.exports.getImagesByPropID = (req,res) =>{
    dbConn.query('SELECT * FROM user_sub_prop_galleries WHERE propertyId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'get images by property id ')
        res.send({
            status:true,
            data:result
        })
    })
}
//get property type
module.exports.getAllPropertyType = (req,res) => {
    sql_propsType = "SELECT * FROM property_types"
    dbConn.query(sql_propsType,(err,result)=>{
        if(err) err_service.errorNotification(err,'get property type')
        res.send({
            data:result
        })
    })
}
//get property porpose
module.exports.getAllPropertyPurposes = (req,res) => {
    sql_propsPutposes = "SELECT * FROM property_purposes"
    dbConn.query(sql_propsPutposes,(err,result)=>{
        if(err) err_service.errorNotification(err,'get property purpose')
        res.send({
            data:result
        })
    })
}
//get all futures list
module.exports.getAllFutures = (req,res) => {
    dbConn.query('SELECT * FROM `property_additional_features`',(err,result)=>{
        if(err) err_service(err,'get all features detail ')
        res.send({
            data:result
        })
    })
}
//update property detail
module.exports.updateProperty = (req,res) => {
    //info
    let props_ID = req.body.propsID
    let title = req.body.title
    let desc = req.body.desc
    let ppID = req.body.props_pp_ID
    let TypeID = req.body.props_type_ID
    let priceSale = req.body.priseSale
    let priceRent = req.body.priceRent
    let saleStatus = req.body.saleStatus

    //address
    let subDisID = req.body.subDistricts_ID
    let house_No =req.body.house_No

    //rooms
    let floor = req.body.floor
    let bedrooms = req.body.bedrooms
    let bathrooms = req.body.bathrooms
    let garages = req.body.garages
    let area = req.body.area
    let yearBuilt = req.body.yearBuilt

    //additional
    let lat = req.body.lat
    let lng = req.body.lng
    let images = req.body.gallery
    let featuresID = []
    if(req.body.futureID !== undefined){
        for(let i = 0 ; i < req.body.futureID.length ; i++){
            featuresID[i] =  Number(req.body.futureID[i])
        }
    }
    if(priceSale === undefined || priceSale === 'undefined' || priceSale === '' || priceSale === null){
        priceSale = 0 
    }
    if(priceRent === undefined || priceRent === 'undefined' || priceRent === '' || priceRent === null){
        priceRent = 0 
    }
    // update sub props ตารางใหญ่
    sql_update_userSubProps = `
        UPDATE user_sub_props
        SET title = ? , 
            description = ? , 
            propFor = ? , 
            propType = ? ,
            priceSale = ? , 
            priceRent = ? , 
            lat = ? ,
            lng = ? , 
            houseNo = ? ,
            addressId = ? , 
            saleStatus = ? ,
            updatedAt = ? 
        WHERE id = ?`

    valueUpdateUserSubProp = [
        title,
        desc,
        ppID,
        TypeID,
        priceSale,
        priceRent,
        lat,
        lng,
        house_No,
        subDisID,
        saleStatus,
        date,
        props_ID
    ]


    sql_update_rooms = `
        UPDATE user_sub_prop_additionals
            SET bedrooms = ${bedrooms} , 
            bathrooms = ${bathrooms} , 
            garages = ${garages} , 
            area = ${area} , 
            floor = ${floor} , 
            yearBuilt = ${yearBuilt}
        WHERE propertyId = ${props_ID} `

    sqlGetRoomsId = `
        SELECT 
            id 
        FROM user_sub_prop_additionals 
        WHERE propertyId = ${props_ID}
    `
    dbConn.query(sql_update_userSubProps,valueUpdateUserSubProp,(err,result)=>{
        if(err) err_service.errorNotification(err,'update property => main property')
        // update additional
        dbConn.query(sql_update_rooms,(err,result)=>{
            if(err) err_service.errorNotification(err,'update property => additional table (rooms')
            // get additional id
            dbConn.query(sqlGetRoomsId,(err,result)=>{
                if(err)err_service.errorNotification(err,'update property => get additional ID')
                let additionalID = result[0].id
                chcekFeatures(additionalID,featuresID);
                // images
                if(images.length != 0){
                    for(let i = 0 ; i < images.length ; i++){
                        insertPropImage(images[i],props_ID);
                    }
                }
                res.send({
                    status: true,
                    msg:'อัพเดตสำเร็จ'
                })
            })
        })
    }
)

}
//delete property By id
module.exports.deletePropertyById = (req,res,id) => {
    // ลบ image prop
    deleteImageProperty(req.params.id)
    dbConn.query('DELETE FROM user_sub_props WHERE id = ? ',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'delete property by id')
        res.send({
            status:true,
            msg:'delete success '
        })
    })
}

// delete property when user was deleted
module.exports.deletePropertyByUser = (id) =>{
    //ลบภาพ
    deleteImageProperty(id)
    //ลบบ้าน
    dbConn.query('DELETE FROM user_sub_props WHERE id = ? ',[id],(err,result)=>{
        if(err) err_service.errorNotification(err,'delete property by id')
    })
}

//chang property status
module.exports.changePropertyStatus = (req,res) => {
    id = req.body.id
    displayStatus = req.body.displayStatus

    if(displayStatus === 1){
        displayStatus = 0
    }else{
        displayStatus = 1
    }

    sql = `
        UPDATE user_sub_props 
        SET displayStatus = ${displayStatus}
        WHERE id =${id};
    `

    dbConn.query(sql,(err,result)=>{ 
        if(err)err_service.errorNotification(err,'change property status')
        if(displayStatus === 1){
            res.send({
                status:true,
                msg:'เปิดการมองเห็นเรียบร้อยแล้ว'
            })
        }else{
            res.send({
                status:true,
                msg:'ปิดการมองเห็นเรียบร้อยแล้ว'
            })
        }
    })
}


//chcekFeatures
function chcekFeatures(additionalID,featuresID){
    // check ว่ามี id ไหม มีลบให้หมดแล้วค่อย add เข้าไปใหม่
    dbConn.query(`SELECT * FROM user_sub_prop_additional_features WHERE additionalId = ? AND NOT featuresId = 'NULL'`,[additionalID],(err,result)=>{
        if(err) err_service.errorNotification(err,'check features')

        if(featuresID){
            // case 1 กรณีแก้ไข ft
            if(result.length != 0 &&  featuresID.length != 0){
                // console.log('case 1');
                deleteFeatures(additionalID)
                updateFeatures(featuresID,additionalID)
            }
            // case 2 กรณีไม่ติ๊ก ft เลยสักอันจากที่ ติ๊กอยู่แล้ว
            if(result.length != 0 &&  featuresID.length === 0){
                // console.log('case 2');
                deleteFeatures(additionalID,true)
            }
            // case 3 กรณีไม่มีข้อมูลใน ft อยู่แล้วแต่เพิ่มเข้าไป
            if(result.length === 0 &&  featuresID.length != 0){
                // console.log('case 3');
                updateFeatures(featuresID,additionalID)
            }
        }else{
            // console.log('SET NULL ');
            sqlSetNull = `
            
            `
            dbConn.query(`INSERT INTO user_sub_prop_additional_features(additionalId,featuresId) VALUES(?,NULL)`,[additionalID],(err,result)=>{
                if(err) err_service.errorNotification(err,'chcekFeatures => set NULL')
            })
        }
    })
}
//deleteFeatures
function deleteFeatures(additionalID,addNull){
    //delete features
    dbConn.query(`DELETE FROM user_sub_prop_additional_features WHERE additionalId = ?`,[additionalID],(err,result)=>{
        if(err) err_service.errorNotification(err,'update property => delete all feature for add new features')
        if(addNull === true){
            // add null features for default value
            dbConn.query(`INSERT INTO user_sub_prop_additional_features(additionalId,featuresId) VALUES(?,NULL)`,[additionalID],(err,result)=>{
                if(err)err_service.errorNotification(err,'update property => add default feature after delete all features')
            })
        }
    })
}
//updateFeatures
function updateFeatures(featuresID,additionalID){
    //insert future
    for(let i = 0 ; i < featuresID.length ; i++){
        sql_insert_futures = `
            INSERT INTO user_sub_prop_additional_features(
                additionalId,
                featuresId)
            VALUES(
                ${additionalID},
                ${featuresID[i]})`
        dbConn.query(sql_insert_futures,(err,result)=>{
            if(err) err_service.errorNotification(err,'update property => add new feature after delete and add default features')
        })
    }
}
//insert images
function insertPropImage(image,id){
    dbConn.query('INSERT INTO user_sub_prop_galleries(path,propertyId) VALUE(?,?)',[image,id],(err,result)=>{
        if(err) err_service.errorNotification(err,'insert props images')
    })
}
//delete image property
function deleteImageProperty(id){
    sqlGetPictureName = `
        SELECT
            *
        FROM user_sub_prop_galleries
        WHERE propertyId = ${id};
        `

    sqlDeletePropertyGallery = `
        DELETE FROM user_sub_prop_galleries
        WHERE propertyId = ${id};
    `

    dbConn.query(sqlGetPictureName,(err,result)=>{
        if(err)err_service.errorNotification(err,'delete image property => Get Picture Name')
        let propertyImagePath = result

        for(let i = 0 ; i < propertyImagePath.length;i++){
            multer_s.deleteImage('properties/'+propertyImagePath[i].path)
        }

        dbConn.query(sqlDeletePropertyGallery,(err,result)=>{
            if(err)err_service.errorNotification(err,'delete image property => delete props gallery db')
        })


    })
}








