const { OurService } = require('../model/index.model')

module.exports = {

    getOurServices: async(req, res) => {
        try {
            const services = await OurService.findAll()
            res.send({status: 1, data: services})
        } catch (err) {
            res.status(500).send(err.message)
        }
    }

}