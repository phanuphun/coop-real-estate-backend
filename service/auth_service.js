const jwt = require("jsonwebtoken");

//request token
module.exports.requiredToken = (req,res,next) => {
    let headers = req.headers['token'];
    // console.log('Required Headers Token ==> ',headers);
    if(typeof headers !== 'undefined' && headers !==''){
        req.token = headers;
        if(verifyToken(headers)){
            next();
        }else{
            console.log('token invalid');
            res.send({
                errMsg:'token invalid'
            })
        }

    }else{
        console.log('token required....');
        res.send({
            errMsg:'token required....'
        })
    }
}

//ตรวจสอบ token
// module.exports.verifyToken = (token) => {
//     return jwt.verify(token, "privatekey", (err, result) => {
//         if (err) {
//             return false
//         } else {
//             return true
//         }
//     });
// }

const verifyToken = (token) => {
    return jwt.verify(token, "privatekey", (err, result) => {
        if (err) {
            return false
        } else {
            return true
        }
    });
}

//check Token
module.exports.checkToken = (req,res) =>{
    console.log(req.headers['token']);
    jwt.verify(req.headers['token'], "privatekey", (err, result) => {
        if (err) {
            res.send({
                status:false
            })
            console.log(err);
        } else {
            res.send({
                status:true
            })
            console.log('=>',result);
        }
    });
}
