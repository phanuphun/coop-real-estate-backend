let mysql = require('mysql2');

const conn = mysql.createConnection({

    // LocalHost

    host:'127.0.0.1',
    user:'khem',
    password:'DeltasoftPassword',
    database:'test',

    // host:'159.223.59.238',
    // user:'khem',
    // password:'DeltasoftPassword',
    // database:'deltapropertydb',
    // port:3306,
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
