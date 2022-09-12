require('dotenv').config()

const PORT = process.env.PORT 
const HOST = process.env.HOST
const USER = process.env.USER
const PASSWORD = process.env.PASSWORD
const DATABASE = process.env.DATABASE
const SECRET = process.env.SECRET
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const CHANNEL_SECRET = process.env.CHANNEL_SECRET
const NGROK = process.env.NGROK
module.exports = {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DATABASE,
    SECRET,
    CHANNEL_ACCESS_TOKEN,
    CHANNEL_SECRET,
    NGROK
}
