require('dotenv').config();
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

const route_admin = require('./backend_admin/route_admin')


const port = 3500

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, "/public")))

app.use(route_admin)

app.listen(port,()=>{
    console.log('server is running in port: ',port)
})
