const mongoose = require("mongoose")
const {Schema}=mongoose;

const Conversationschema = new Schema({
    members:{
        type:Array,
        length:{min:2}
    },
    lastMessage:{
        type: Object,
        length:{min:2}
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Conversations",Conversationschema);