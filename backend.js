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

//user cliend side route
app.use('/api', require('./routes/index.router'))


//admin route
app.use(route_admin)

app.listen(PORT || 3000, () => {
  console.log('server is running on port: '+PORT); 
}) 
