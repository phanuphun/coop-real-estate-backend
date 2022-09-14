require('dotenv').config()

const PORT = process.env.PORT
const HOST = process.env.HOST
// const HOST = 'https://deltaproperty.me'
const USER = process.env.USER
// const USER = 'khem'
const PASSWORD = process.env.PASSWORD
// const PASSWORD = 'DeltasoftPassword'
const DATABASE = process.env.DATABASE
const SECRET = process.env.SECRET
const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN
const CHANNEL_SECRET = process.env.CHANNEL_SECRET
const LINE_NOTIFY_KEY  = process.env.LINE_NOTIFY_KEY
const NGROK = process.env.NGROK
const ADMIN_PATH = process.env.ADMIN_PATH
module.exports = {
    HOST,
    PORT,
    USER,
    PASSWORD,
    DATABASE,
    SECRET,
    CHANNEL_ACCESS_TOKEN,
    CHANNEL_SECRET,
    LINE_NOTIFY_KEY,
    NGROK,
    ADMIN_PATH
}
