const { ContactUs } = require("../model/index.model")


module.exports = { 

    createContact: async(req, res) => {
        try {
            const { name, email, phone, message } = req.body

            let create = await ContactUs.create({
                name: name,
                email: email,
                phone: phone,
                message: message,
                replyStatus: 0 || false
            })

            return res.send({ status: 1, message: 'ALERT.SUBMITTED_CONTACT' })

        } catch (err) {
            return res.status(500).send(err.message)
        }
    }

}