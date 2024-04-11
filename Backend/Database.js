const { configDotenv } = require('dotenv');
const mongoose = require('mongoose');
configDotenv()
const ConnectToMongo=async()=>{
    try {
        await mongoose.connect(process.env.MongoUri)
        console.log("Database Connected");
    } catch (error) {
        console.log(error.errorResponse.errmsg);
    }
}

module.exports=ConnectToMongo