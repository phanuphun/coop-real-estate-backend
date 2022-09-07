let mysql = require('mysql2');

const conn = mysql.createConnection({

    // LocalHost
    host:'localhost',
    user:'root',
    password:'',
    database:'test',

})

conn.connect((err)=>{
     if (err) {
        console.log('db error');
        throw err
    }else{
        console.log('db connected');
    }
})

module.exports = conn;
