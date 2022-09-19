const jwt = require('jsonwebtoken')
const { SECRET } = require('../../config/config')
const { Users } = require('../../model/index.model')

module.exports = {
    verify: async(req, res, next) => {
        // console.log(req.headers.authorization);
        const token = String(req.headers.authorization).split(' ')[1]

        if (token) {
            jwt.verify(token, SECRET, async(err, tokendata) => {
                if (err) {
                    return res.send({ status: 400, message: 'กรุณาเข้าสู่ระบบ Please Sign in.' })
                } else {
                    const response = await Users.findOne({
                    where: {
                        id: tokendata.userId
                        }
                    })
                    if (response) {
                        if (response.displayStatus == false || response.displayStatus == 0){
                            return res.send({ status: 400, message: 'เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบอีกครั้ง Something Went Wrong, Please Sign in.' })
                        }
                        res.locals.userId = response.id
                        next();
                    } else {
                        return res.send({ status: 400, message: 'ไม่มีผู้ใช้งานนี้ในระบบ No User exists.' })
                    }       
                }
            })  
        } else {
            return res.send({ status: 400, message: 'กรุณาเข้าสู่ระบบ Please Sign in.' })
        }
        
    }
}