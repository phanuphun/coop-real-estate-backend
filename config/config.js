require('dotenv').config()

const PORT = 3500
const HOST = 'http://localhost:3500'
// const HOST = 'https://deltaproperty.me'
const USER = 'root'
// const USER = 'khem'
const PASSWORD = ''
// const PASSWORD = 'DeltasoftPassword'
const DATABASE = 'test'
const SECRET = 'eyJhbGciOiJIUzI1NiJ9.SLy9Fqdjf5s4mQzsjgrg9nKh61iaKzKVnF0hrpuLFtGjobs2FRQFzVOndjmUPB_sCZ8Ks1dcN4tMYwrXSTC2x8CSq9Zj8TVkSLqR74J4bN7sIgRdQqwer49W17U3v14T29aJarPQsb_uu3wrim4NJMyzAsMWMcFet6VxOOMtlk8.HzUnxpsgAdBXuaUhTsdJ-I_49fkaKjm23Egn4M8PLyY'
const CHANNEL_ACCESS_TOKEN = 'aLmOpJstfmo1/2RCGo7236NKRoE879jCYavY51sob643Rzs7zYGSVAF1dNt1HU657ySCC7cObQfiFputiay75zIImxVEfOGRJj2JZJo12YiPIaS9fIVzdT0FdIoMDOls0vkIBJ6vWLtIIs2WNh60FQdB04t89/1O/w1cDnyilFU='
const CHANNEL_SECRET = '8b8e0c944b9dd299056c250fb3d08b34'
const NGROK = 'https://deltaproperty.me'
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
