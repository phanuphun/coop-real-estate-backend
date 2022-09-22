const { AboutUs } = require('../model/index.model')

module.exports = {

    getAboutUs: async(req, res) => {
        try {
            let data = await AboutUs.findOne({
                order: [['id', 'desc']]
            })
            return res.send({ status: 1, data: data })
        } catch (err) {
            res.status(500).send(err.message)
        }
    }
}