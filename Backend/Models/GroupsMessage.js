const mongoose = require('mongoose');
const {Schema}=mongoose;

const GroupsMessage = new Schema({
    groupId:{
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

module.exports = mongoose.model("GroupsMessage",GroupsMessage);