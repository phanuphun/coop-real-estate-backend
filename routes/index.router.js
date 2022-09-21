const express = require("express");
const app = express();

//app use property route
app.use('/property', require('./Property'))

//app use address route
app.use('/address', require('./Address'))

//app userProperty route
app.use('/userProperty', require('./UserProperty'))

//app Users route
app.use('/users', require('./Users'))

//app use faqs route
app.use('/faqs', require('./Faqs'))

//app use packages route
app.use('/packages', require('./Package'))

//app use Our Services route
app.use('/ourServices', require('./OurService'))

//app use line Route for webhook
app.use('/line', require('./LineNotify'))

//app use detailReport route
app.use('/detailReport', require('./DetailReport'))

//app use contact us Router
app.use('/contactUs', require('./ContactUs'))

//app use feedback router
app.use('/feedback', require('./Feedback'))

module.exports = app;