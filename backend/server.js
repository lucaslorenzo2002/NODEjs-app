const express = require('express');
const userRouter = require('./routes/userRoutes');
const messageRouter = require('./routes/messageRoutes');
const authRouter = require('./routes/authRoutes');
const path = require('path');
const cookieParser = require('cookie-parser')

const app = express();

//MONGOOSE CONNECTION
const connection = require('./config/mongooseConfig')

connection
.then(() => console.log('mongoose conectado'))
.catch((err) => console.log(err))

//REQUIRE MONGOOSE CLASES
const  UserCrud  = require('./container/usersContainer');
const MessageCrud = require('./container/messagesContainer');

//MONGOOSE CONTAINERS
const usersContainer = new UserCrud(connection);
const messagesContainer = new MessageCrud(connection);

module.exports = usersContainer

//HANDLEBARS
const exphbs = require('express-handlebars');
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')


//MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/messages', messageRouter)


//SOCKETS
const{ Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const httpServer = new HttpServer(app);
const IO = new IOServer(httpServer);


IO.on('connection', socket => {
  console.log(`${socket.id} is connected`);

  socket.on('message', async(data) => {

      await messagesContainer.postMessage(data)

      IO.sockets.emit('new message', await listarMensajesNormalizados())
  }) 
})

//DATA NORMALIZER
const { normalize, schema } = require('normalizr');

const authorSchema = new schema.Entity('author', {}, {idAttribute: 'username'})

const messageSchema = new schema.Entity('message', {author: authorSchema}, {idAttribute: 'id'})

const chat = new schema.Entity('chat', {messages: [messageSchema]}, {idAttribute: 'id'}) 

const chatNormalizado = (mensajesConId) => {
    return normalize(mensajesConId, chat)
};  

const listarMensajesNormalizados = async() => {
  const mensajes = await messagesContainer.readMessages();
  return chatNormalizado({id:'mensajes', messages: mensajes})
}



//PORT CONNECTION
const PORT = process.env.PORT || 8080;

const server = httpServer.listen(PORT, () => {
    console.log(` server listening on PORT: ${PORT}`)
})

server.on('error', err => console.log(err))


