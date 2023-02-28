const User = require('../schemas/userModel');

class UserCrud{
    constructor(connection){
        this.connection = connection
    }

    async createUser(newUser){
        try{
            const user = await User.create(newUser);
            console.log('usuario creado');
            return user
        }catch(err){
            console.log(err)
        }
    }

    async readUser(username){
        try{
            const data = await User.findOne({username});
            return data
        }catch(err){
            console.log(err);
        }
    }

    async readUserById(id){
        try{
            const data = await User.findById(id);
            return data
        }catch(err){
            console.log(err);
        }
    }

    async deleteUser(id){
        try{
            const user = await User.deleteOne({id: id})
            return user
        }catch(err){
            throw new Error + err
        }
    } 
}

module.exports = UserCrud