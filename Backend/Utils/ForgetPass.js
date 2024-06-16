const dotenv = require('dotenv');
dotenv.config();

const nodemailer = require('nodemailer');

const ForgetPass = async (email, name,code) => {
    const subject =`Need to reset your password?`
    const text = `
        Hello ${name}, Need to reset your password?
        Use your secret code!

        ${code}
        
        If you did not forget your password, you can ignore this email.
        Otherwise, please use the code to change your password.`;

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


module.exports = ForgetPass