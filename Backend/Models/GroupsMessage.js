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
        type: String,
    }
})

module.exports = mongoose.model("GroupsMessage",GroupsMessage);