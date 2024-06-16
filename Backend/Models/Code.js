const mongoose = require('mongoose');
const { Schema } = mongoose;
const CodeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
})
module.exports = mongoose.model("Code", CodeSchema)