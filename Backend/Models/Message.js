const mongoose = require('mongoose');
const {Schema}=mongoose;

const Messages = new Schema({
    conversationId:{
        type: String,
        required: true
    },
    senderId:{
        type: String,
        required: true
    },
    senderUsername:{
        type: String,
        // required: true
    },
    text:{
        type: String,
        required: true
    },
    date:{
        type: String,
    }
})

module.exports = mongoose.model("Message",Messages);