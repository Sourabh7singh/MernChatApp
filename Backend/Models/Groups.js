const mongoose = require('mongoose');
const {Schema} = mongoose;

const Group = new Schema({
    groupName:{
        type: String,
        required: true
    },
    profile:{
        type: String,
    },
    admin:{
        type: String,
        required: true
    },
    members:{
        type: Array,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model("Group",Group)