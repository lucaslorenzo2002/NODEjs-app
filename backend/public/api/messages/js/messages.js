window.addEventListener('load', () => {
const socket = io();
dayjs.extend(window.dayjs_plugin_localizedFormat)


//SCHEMAS
const authorSchema = new normalizr.schema.Entity('author', {}, {idAttribute: 'username'})
const messageSchema = new normalizr.schema.Entity('message', {author: authorSchema}, {idAttribute: 'id'})
const Chat = new normalizr.schema.Entity('chat', {messages: [messageSchema]}, {idAttribute: 'id'})  


//DOM
const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const output = document.querySelector('#output');


//FETCH A MONGODB
fetch("/api/users/data-json")
.then(response => response.json())
.then(data => {

    const email = data.user.email;
    const name = data.user.name;
    const lastName = data.user.lastname;
    const username = data.user.username;

chat.addEventListener('submit', (e) => {
    e.preventDefault()
        let msg = {
        author: {
            email,
            name,
            lastName,
            username
        },
        message: message.value,
        fyh: dayjs().format('LLL'),
        id: 1
    } 
    console.log(msg);
    socket.emit('message', msg)
})
})
socket.on('new message', (data) => {
    const objDenormalizado = normalizr.denormalize(data.result, Chat, data.entities)
    
    
    const dataMsj = objDenormalizado.messages
    

    
    dataMsj.map(msj => {

        const message = document.createElement('li');
        message.classList.add('msg')
        message.innerHTML = `<p><strong class="username">${msj.author.username}</strong> <span class="msj">${msj.message}</span> <span class="date">${msj.fyh}</span> </p>`
        
        output.appendChild(message)

        const delBtn = document.createElement('button');
        delBtn.classList.add('delBtn')
        delBtn.innerHTML = 'x'
        delBtn.addEventListener('click', () => {
            
        })

        message.appendChild(delBtn)

    }).join(" ")
    
 }) 

})
