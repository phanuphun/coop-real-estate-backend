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
                    return res.status(400).send({ status: 400, message: 'Unauthorization, Please login' })
                } else {
                    const response = await Users.findOne({
                    where: {
                        id: tokendata.userId
                        }
                    })
                    if (response) {
                        res.locals.userId = response.id
                        // console.log(req.body.userId);
                        // console.log(token);
                        next();
                        // res.send(response)
                    } else {
                        return res.status(400).send({ status: 400, message: 'No user exist, Please login' })
                    }       
                }
            })  
        } else {
            return res.status(400).send({ status: 400, message: 'Unauthorization, Please login' })
        }
        
    }
}