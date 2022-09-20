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

            return res.send({ status: 1, message: 'ส่งความคิดเห็นสำเร็จ Your feedback has been submitted.' })

        } catch (err) {
            res.status(500).send(err.message)
        }
    }

}