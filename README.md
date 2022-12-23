## Tools
- [Multer js](https://www.npmjs.com/package/multer)
- [CORS](https://www.npmjs.com/package/cors)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Line Bot SDK](https://github.com/line/line-bot-sdk-nodejs)
- [Date and Time](https://www.npmjs.com/package/date-and-time)
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [Sequelize](https://sequelize.org/)
- [Nodemailer](https://nodemailer.com/about/)

## Folders
**Client**
- config 
- controller 
- model
- services

**Admin**
- [/backend_admin](https://github.com/parnuphun/DeltaProperty_Backend/tree/main/backend_admin)
  - [/controller](https://github.com/parnuphun/DeltaProperty_Backend/tree/main/backend_admin/controller)
  - [/database.js](https://github.com/parnuphun/DeltaProperty_Backend/blob/main/backend_admin/database.js) (เชื่อม Database ฝั่ง admin)
  - [/route_admin.js](https://github.com/parnuphun/DeltaProperty_Backend/blob/main/backend_admin/route_admin.js) (api path)
- [/service](https://github.com/parnuphun/DeltaProperty_Backend/tree/main/service) (เติม s ของ client)
  - [/multer.js](https://github.com/parnuphun/DeltaProperty_Backend/blob/main/service/multer.js) (อัพโหลดรูปฝั่ง admin)
  - [/auth_service.js](https://github.com/parnuphun/DeltaProperty_Backend/blob/main/service/auth_service.js) (Check req token)


## Note
  - [Email](https://github.com/parnuphun/DeltaProperty_Backend/blob/main/backend_admin/controller/other_controller.js)
 ```ruby
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your email',
            pass: 'App password'
        }
    });
 ```
