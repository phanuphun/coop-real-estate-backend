const lineN = require('line-notify-nodejs')('1ocSpbTTTf6JQIcUcJNDtqqsFfeWFzvbXPXupQhd6JU');
const fs = require('fs')
const path = require('path')
//test line notify
module.exports.lineNotify = (data) => {
    // console.log(data);

    let date = new Date(data[0].dateTransfer)
    let dateThai = date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

    let period

    console.log('=>',data[0].periodId);

    if(data[0].periodId === 1){
        period = '1 เดือน'
    }else if(data[0].periodId === 2){
        period = '2 เดือน'
    }else if(data[0].periodId === 3){
        period = '3 เดือน'
    }

    msg = `
มีการแจ้งโอนเงินเข้ามา
โดยคุณ : ${data[0].userFname} ${data[0].userLname}
สมัครแพ็คเกจ : ${data[0].packageName}
รูปแบบ : ${period}
ราคา : ${data[0].price}
วันที่ : ${dateThai}
            `

        lineN.notify({
            message: msg,
        }).then(() => {
            console.log('send completed!');
        });

}
