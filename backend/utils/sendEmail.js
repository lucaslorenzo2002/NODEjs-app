const nodemailer = require('nodemailer');

const sendEmail = async(from, to, subject, message) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }, 
        tls:{
            rejectUnauthorized: false
        }
    })

    const options = {
        from: from,
        to: to,
        subject: subject,
        hmtl: message
    }

    transporter.sendMail(options, function(err, info) {
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
    })
}

module.exports = sendEmail