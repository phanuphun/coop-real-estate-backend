const {
    Feedback
} = require('../model/index.model')

module.exports = {

    sendFeedback: async(req, res) => {
        try {
            const { email, message } = req.body

            let send = await Feedback.create({
                email: email,
                message: message
            })

            return res.send({ status: 1, message: 'ALERT.SUBMITTED_FEEDBACK' })

        } catch (err) {
            res.status(500).send(err.message)
        }
    }

}