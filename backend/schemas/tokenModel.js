const mongoose = require('mongoose');

const tokenCollection = "tokens";

const tokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    token:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        required: true
    },
    expiresAt:{
        type: Date,
        required: true
    }
})

const Token = mongoose.model(tokenCollection, tokenSchema);
module.exports = Token