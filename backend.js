const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const path = require("path");
const { PORT } = require('./config/config')
const route_admin = require('./backend_admin/route_admin')

app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "allowedHeaders": "Authorization,Content-Type",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}))


app.use(cors());
app.use(express.json({extended: false}));
app.use(express.urlencoded({ extended: true}));

//use express static folder
app.use(express.static(path.join(__dirname, "/public"))); 

//database
// const syncDatabase = require("./config/sync-resync");
const db = require("./model/index.model");
db.sequelize.sync();
// syncDatabase(false, db);

app.get('/', (req, res) => {
  res.send('welcome to real-estate api')
})

//app use property route
app.use('/property', require('./routes/Property'))

//app use address route
app.use('/address', require('./routes/Address'))

//app userProperty route
app.use('/userProperty', require('./routes/UserProperty'))

//app Users route
app.use('/users', require('./routes/Users'))

//app use faqs route
app.use('/faqs', require('./routes/Faqs'))

//app use packages route
app.use('/packages', require('./routes/Package'))

//app use Our Services route
app.use('/ourServices', require('./routes/OurService'))

//app use line Route for webhook
app.use('/line', require('./routes/LineNotify'))

//app use detailReport route
app.use('/detailReport', require('./routes/DetailReport'))

//app use contact us Router
app.use('/contactUs', require('./routes/ContactUs'))

//app use feedback router
app.use('/feedback', require('./routes/Feedback'))

//admin route
app.use(route_admin)

app.listen(PORT || 3000, () => {
  console.log('server is running on port: '+PORT); 
}) 
