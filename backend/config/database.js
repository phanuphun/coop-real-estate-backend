const mysql = require('mysql2')

const connect = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

connect.getConnection((err) => {
    if (err) {
        return console.error('Error to connect to database !!!');
    }
});

module.exports = connect;