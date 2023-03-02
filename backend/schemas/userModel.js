const mongoose = require('mongoose');

const userCollection = "users";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
       // required: true
    },
    lastName: {
        type: String,
        //required: true
    },
    username:{
        type: String,
        required: [true, 'please write your username'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'please write a password'],
        minlength: [8, 'password must have at least 8 characters']
    },
    email:{
        type: String,
        required: [true, 'please write an email'],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please write a valid email',
          ] 
    },
    address:{
        type: String,
        required: [true, 'please write an address']
    },
    dni:{
        type: Number,
        required: [true, 'please write your dni']
    },
    phone:{
        type: Number,
        required: [true, 'please write a phone number']
    },
})


const User = mongoose.model(userCollection, userSchema);
module.exports = User