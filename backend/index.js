const express = require("express");
const cors = require("cors");
const app = express();
// const bodyParser = require("body-parser");
const path = require("path");
const { PORT } = require('./config/config')

app.use(cors());
app.use(express.json({extended: false}));
app.use(express.urlencoded({ extended: true}));

//use express static folder
app.use(express.static(path.join(__dirname, "/public"))); 

//database
const syncDatabase = require("./config/sync-resync");
const db = require("./model/index.model");
syncDatabase(false, db);


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

app.use('/line', require('./routes/LineNotify'))


app.listen(PORT || 3000, () => {
  console.log('server is running on port: '+PORT); 
}) 
