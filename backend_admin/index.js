require('dotenv').config();
const express = require('express')
const cors = require('cors')
const route = require('./Route')
const path = require('path')
const app = express()


const port = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "/public")))

app.use(route)

app.listen(port,()=>{
    console.log('server is running in port: ',port)
})
