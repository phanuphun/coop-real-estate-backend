
const {
    DetailReportUser, DetailReportProperty
} = require('../model/index.model')
module.exports = {

    getDetailReportUser: async(req, res) => {
        try {
            const detail = await DetailReportUser.findAll()
            return res.send({ status: 1, data: detail })
        } catch (err) {
            res.status(500).send(err.message)
        }
    },

    getDetailReportProperty: async(req, res) => {
        try {
            const detail = await DetailReportProperty.findAll()
            return res.send({ status: 1, data: detail })
        } catch (err) {
            res.status(500).send(err.message)
        }
    }

} 