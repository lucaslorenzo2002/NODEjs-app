const asyncHandler = require('express-async-handler');

//CONEXION A MONGOOSE
const connection = require('../config/mongooseConfig')

//REQUIRE A CLASES DE MONGOOSE
const  UserCrud  = require('../container/usersContainer');
const  MessageCrud  = require('../container/messagesContainer');

//CONTENEDOR DE MONGOOSE
const messagesContainer = new MessageCrud(connection)

const getChat = asyncHandler(async(req, res) => {

    res.render('chat')

    /* const user = await usersContainer.readUserById(req.user._id)
    if(user){
        const{username, email, name, lastName} = user
        res.render('chat', {
            username, email, name, lastName
        })
    }else{
        res.status(401).json({error: 'not authenticated'})
    } */
})

const deleteMessage = asyncHandler(async(req, res) => {

    const id = parseInt(req.params.id);

    await messagesContainer.deleteMessage(id)

    res.json({proceso: 'ok'})
})

module.exports = {
    getChat,
    deleteMessage
}