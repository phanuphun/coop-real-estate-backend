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
                    return res.send({ status: 400, message: 'ALERT.SIGN_IN' })
                } else {
                    const response = await Users.findOne({
                    where: {
                        id: tokendata.userId
                        }
                    })
                    if (response) {
                        if (response.displayStatus == false || response.displayStatus == 0){
                            return res.send({ status: 400, message: 'ALERT.ERR_SIGN_IN' })
                        }
                        res.locals.userId = response.id
                        next();
                    } else {
                        return res.send({ status: 400, message: 'ALERT.NO_USER_EXIST' })
                    }       
                }
            })  
        } else {
            return res.send({ status: 400, message: 'ALERT.SIGN_IN' })
        }
        
    }
}