const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    author: {
        email:{
            type: String,
            required: true
        }, name:{
            type: String
        }, lastName:{
            type: String
        }, username:{
            type: String
        }
    },
    message: {
        type: String
    },
    fyh: {
        type: String
    }
})

module.exports = mongoose.model('mensaje', messageSchema)