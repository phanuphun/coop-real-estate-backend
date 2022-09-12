
const { Package } = require('../model/index.model')

module.exports = {
    getPackages1M: async(req, res) => {
        try {
            
            const response = await Package.findAll({
                order: [['price1M', 'asc']],
                attributes: { exclude: ['price3M', 'price6M'] }
            })

            let data = []
            response.forEach((res) => {
                let temp = {}
                temp.id = res.id
                temp.name = res.name
                temp.description = res.description
                temp.price = res.price1M
                temp.propertyLimit = res.propertyLimit
                data.push(temp)
            })

            res.send({ status: 1 , data: data})

        } catch (err) {

            res.status(500).send(err.message)
        }
    },
    getPackages3M: async(req, res) => {
        try {

            const response = await Package.findAll({
                order: [['price3M', 'asc']],
                attributes: { exclude: ['price1M', 'price6M'] }
            })

            let data = []

            response.forEach((res) => {
                let temp = {}
                temp.id = res.id
                temp.name = res.name
                temp.description = res.description
                temp.price = res.price3M
                temp.propertyLimit = res.propertyLimit
                data.push(temp)
            })

            res.send({ status: 1 , data: data})
        } catch (err) {
            res.status(500).send(err.message)
        }
    },

    getPackages6M: async(req, res) => {
        try {
            const response = await Package.findAll({
                order: [['price6M', 'asc']],
                attributes: { exclude: ['price1M', 'price3M'] }
            })

            let data = []
            response.forEach((res) => {
                let temp = {}
                temp.id = res.id
                temp.name = res.name
                temp.description = res.description
                temp.price = res.price6M
                temp.propertyLimit = res.propertyLimit
                data.push(temp)
            })

            res.send({ status: 1 , data: data})
        } catch (err) {
            res.status(500).send(err.message)
        }
    },

}