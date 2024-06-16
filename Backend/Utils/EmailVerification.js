const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

const EmailVerification = async (email,name,url) => {
    const subject = `Welcome ${name} to Web Chat App, please verify your email address`;
    const text = `
        Hello ${name},
        You registered an account on Web Chat App, before being able to use your account you need to verify that this is your email address by clicking here: ${url}
        Kind Regards, Web Chat App`;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        secure: true
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = EmailVerification