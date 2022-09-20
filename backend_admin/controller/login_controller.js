const dbConn = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const err_service = require('./../../service/err_service')
const multer_s = require('./../../service/multer')

// Login System
//sign-up / register
module.exports.signup = async (req, res) => {
    // console.log(req.body);
    const username = req.body.userName;
    const email = req.body.email;
    const password = req.body.password;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const phone = req.body.phone;
    const address = req.body.address;
    const image = req.body.gallery[0];

    // เช๋ค email ที่ซ้ำ
    dbConn.query("SELECT * FROM admin WHERE adminEmail = ?",[email],async (err, result) => {
            if(err) err_service.errorNotification(err,'sign up => check email')
            if (result.length > 0) {
                multer_s.deleteImage('avatar/'+image)
                res.send({
                    status:false,
                    msg: "อีเมลล์นี้ถูกใช้ไปแล้ว",
                });
            } else {
                //password decrypt
                bcrypt.hash(password,10,(err,hash)=>{
                    let decrypt_password = hash
                    // insert data
                    dbConn.query(`INSERT INTO admin(adminUsername,adminEmail,adminPassword,adminFname,adminLname,adminPhone,adminAddress,pictureUrl,role_id)
                    VALUES(?,?,?,?,?,?,?,?,1)`,
                    [username, email, decrypt_password ,fname,lname,phone,address,image],(err, result) => {
                            if (err) err_service.errorNotification(err,'sign up => insert data')
                            res.send({
                                status:true,
                                msg: 'สมัครเรียบร้อย',
                            });
                        }
                    );
                })

            }
        }
    );
};

//sign-in  / login
module.exports.signin = (req, res) => {
    email = req.body.email;
    password = req.body.password;

    dbConn.query("SELECT * FROM admin WHERE adminEmail = ?",[email],async (err, result) => {
            if (err) err_service.errorNotification(err,'sign in => check password')
            if (result.length === 1) {
                let dataForCreateToken = {
                    username: result[0].adminUsername,
                    email: result[0].adminEmail,
                };
                // เช็ค pass ว่าตรงกันไหม
                check_password = await bcrypt.compare(
                    password,
                    result[0].adminPassword
                );
                if (check_password === true) {
                    //สร้าง token ด้วย jwt หลัง login เข้ามาแล้ว
                    dbConn.query('SELECT * FROM admin WHERE adminEmail = ?',[email],(err,result)=>{
                        if(err) err_service.errorNotification(err,'Sign in => after chek password')

                        const token = jwt.sign({ dataForCreateToken },"privatekey",{expiresIn:"10h"});
                        res.send({
                            status: true,
                            msg : "เข้าสู่ระบบสำเร็จ",
                            adminData : result,
                            token: token,
                            imagePath : process.env.IMAGE_PATH_AVATAR
                        });

                    })
                } else {
                    res.send({
                        status: false,
                        msg: "กรุณาเช็คอีเมลล์และพาสเวิร์ดของท่าน",
                    });
                }
            } else {
                res.send({
                    status: false,
                    msg: "กรุณาเช็คอีเมลล์และพาสเวิร์ดของท่าน",
                });
            }
        }
    );
};

//new password
module.exports.newPasswordAdmin = (newPass,adminId) => {
    bcrypt.hash(newPass,10,(err,hash)=>{
        if(err) err_service.errorNotification(err,'new password admin fail to hash password')
        let decrypt_password = hash
        // insert data
        dbConn.query('UPDATE admin SET adminPassword = ? WHERE adminId = ? ',[decrypt_password,adminId],(err,result)=>{
            if(err)err_service.errorNotification(err,'new password admin')
        })
    })
}

// module.exports.newPasswordAdmin = newPasswordAdmin
