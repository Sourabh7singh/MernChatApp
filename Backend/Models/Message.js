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
    text:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Message",Messages);