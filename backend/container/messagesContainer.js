
const Message = require('../schemas/messageModel');

class MessageCrud{
    constructor(connection){
        this.connection = connection
    }

    async postMessage(msj){
        try{
            const message = await Message.create(msj)
            return message
        }catch(err){
            throw new Error + err
        }
    }

    async readMessages(){
        try{
            const msjs = await Message.find({}, {_id: 0, __v: 0})
            const stringifiedData = JSON.stringify(msjs);
            const parsedData = JSON.parse(stringifiedData);

            let newId = 1;

            parsedData.forEach(e =>  e.id = newId++ )
    
            return parsedData
        }catch(err){
            throw new Error + err
        }
    }

     async deleteMessage(id){
        try{
            const msg = await Message.deleteOne({id: id})
            return msg
        }catch(err){
            throw new Error + err
        }
    } 
}

module.exports = MessageCrud