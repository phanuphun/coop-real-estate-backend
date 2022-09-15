const dbConn = require('../database')
const err_service = require('./../../service/err_service')

//***************************************************************************** */
// FAQ
//***************************************************************************** */
//get FAQ
module.exports.getFAQ = (req,res) => {
    sql = `
    SELECT
        faqs.* ,
        faq_categories.faqCategoryName
    FROM faqs
    INNER JOIN faq_categories ON faq_categories.faqCategoryId = faqs.category
    ORDER BY faqs.category ASC;`

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
    dbConn.query('SELEcT * FROM faqs WHERE category = ? ',[req.params.id],(err,result)=>{
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
    dbConn.query('SELECT * FROM faq_categories',(err,result)=>{
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
    dbConn.query('SELECT * FROM faqs WHERE faqId = ?',[req.params.id],(err,result)=>{
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
    dbConn.query('INSERT INTO faqs(faqQ,faqA,category) VALUES(?,?,?)',[req.body.faq_Q,req.body.faq_A,req.body.faq_category],(err,result)=>{
        if(err) err_service.errorNotification(err,'insertFAQ')
        res.send({
            status:true,
            msg:'เพิ่มสำเร็จ'
        })
    })
}
//update FAQ
module.exports.updateFAQ = (req,res) => {
    dbConn.query('UPDATE faqs SET faqQ = ? , faqA = ? , category = ? WHERE faqId =  ? ',
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
    dbConn.query('DELETE FROM faqs WHERE faqId = ?',[id],(err,result)=>{
        if(err) err_service.errorNotification(err,'deleteFAQ')
        res.send({
            status:true,
            msg:'ลบสำเร็จ'
        })
    })
}
//change status FAQ (on-off)
module.exports.changeStatusFAQ = (req,res) => {
    dbConn.query('SELECT displayStatus FROM faqs WHERE faqId = ?',[req.params.id],(err,result)=>{
        if(err) err_service.errorNotification(err,'change status faq => get status by id')
        console.log(result[0].displayStatus);
        let newStatus
        if(result[0].displayStatus === 0){
            newStatus = 1
        }else if(result[0].displayStatus === 1){
            newStatus = 0
        }
        dbConn.query('UPDATE faqs SET displayStatus = ? WHERE faqId = ?',[newStatus,req.params.id],(err,result)=>{
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
