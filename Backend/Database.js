const mongoose = require('mongoose');

const ConnectToMongo=async()=>{
    try {
        await mongoose.connect("mongodb+srv://Admin:Admin123@mernchatapp.iprpto1.mongodb.net/MernChatApp?retryWrites=true&w=majority&appName=MernChatApp")
        console.log("Database Connected");
    } catch (error) {
        console.log(error.errorResponse.errmsg);
    }
}

module.exports=ConnectToMongo