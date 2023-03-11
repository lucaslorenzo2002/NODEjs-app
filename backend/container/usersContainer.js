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

    async readUserByMail(email){
        try{
            const data = await User.findOne({email});
            return data
        }catch(err){
            console.log(err);
        }
    }

    async readUserById(id){
        try{
            const data = await User.findById(id).lean();
            return data
        }catch(err){
            console.log(err);
        }
    }

    async updateUser(id, username, email, address, phone){
        try {
            const data = await User.updateOne({_id: id}, {username, email, address, phone});
            return data
        } catch (error) {
            console.log(error);
        }
    } 
}

module.exports = UserCrud