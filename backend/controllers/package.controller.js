const { async } = require('rxjs')
const { Package } = require('../model/index.model')

module.exports = {
    getPackagesMonthly: async(req, res) => {
        try {
            const response = await Package.findAll({
                order: [['priceM', 'asc']],
                attributes: { exclude: ['priceY'] }
            })

            let data = []
            response.forEach((res) => {
                let temp = {}
                temp.id = res.id
                temp.name = res.name
                temp.description = res.description
                temp.price = res.priceM
                temp.propertyLimit = res.propertyLimit
                data.push(temp)
            })

            res.send({ status: 1 , data: response})
        } catch (err) {
            res.status(500).send(err.message)
        }
    },

    getPackagesYearly: async(req, res) => {
        try {
            const response = await Package.findAll({
                order: [['priceY', 'asc']],
                attributes: { exclude: ['priceM'] }
            })
            let data = []
            response.forEach((res) => {
                let temp = {}
                temp.id = res.id
                temp.name = res.name
                temp.description = res.description
                temp.price = res.priceY
                temp.propertyLimit = res.propertyLimit
                data.push(temp)
            })
            
            res.send({ status: 1, data: data })
        } catch (err) {
            res.status(500).send(err.message)
        }
    }
}