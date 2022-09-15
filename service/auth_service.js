const jwt = require("jsonwebtoken");

//request token
module.exports.requiredToken = (req,res,next) => {
    let headers = String(req.headers['authorization']).split(' ')[1];
    // console.log(headers);
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
    let headers = String(req.headers['authorization']).split(' ')[1];
    jwt.verify(headers, "privatekey", (err, result) => {
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
