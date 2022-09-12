const { Faq, FaqCategory, FaqHelpful } = require('../model/index.model')

module.exports = {
    getFaqs: async(req, res) => {
        try {
            const faqs = await Faq.findAll({
                where: {
                    displayStatus: 1 || true
                },
                order: [['faqId', 'desc']],
                include: [
                    {
                        model: FaqCategory,
                        attributes: ['faqCategoryName']
                    }
                ]
            
            })
            let data = []
            faqs.forEach((faq) => {
                let temp = {}
                temp.id = faq.faqId
                temp.faqQ = faq.faqQ
                temp.faqA = faq.faqA
                temp.category = faq.faq_category.faqCategoryName
                data.push(temp)
            })
            res.send({ status: 1 , data: data})
        } catch (err) {
            res.status(500).send(err.message)
        }
    },

    setFaqHelful: async(req, res) => {
        try {
            const userId = res.locals.userId
            const faqId = req.params.faqId
            const review = req.body.review
            const exist = await FaqHelpful.findOne({
                where: {
                    userId: userId,
                    faqId: faqId,
                }
            })
            // res.send({status: 1, message: exist})
            if (exist) {
                if (exist.helpful != review) {
                    const setReview = await FaqHelpful.update({
                        helpful: review
                    },
                    {
                        where: {
                            userId: userId,
                            faqId: faqId
                        }
                    })
                    res.send({ status: 1, message: 'ความเห็นของคุณถูกเพิ่มแล้ว' })
                }else {
                  res.send({ status: 2 , message: 'ความเห็นของคุณมีอยู่แล้ว'})  
                }
            } else {
                const setReview = await FaqHelpful.create({
                    userId: userId,
                    faqId: faqId,
                    helpful: review
                })
                res.send({ status: 1, message: 'ความเห็นของคุณถูกเพิ่มแล้ว' })
            }

        } catch (err) {
            res.status(500).send(err.message)
        }
    }
}