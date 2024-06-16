const { configDotenv } = require("dotenv");

configDotenv();

const limit = Number(process.env.OTP_LENGTH);
const GenerateOtp=()=>{
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < limit; i++ ) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

module.exports = GenerateOtp