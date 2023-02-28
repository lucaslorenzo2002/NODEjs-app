const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../schemas/userModel');

const auth = asyncHandler(async(req, res, next) => {
    
    try{
        
        const token = await req.cookies.token
        
    
        if(!token){
            return res.status(401).json({error: 'not authorized'})
        } 
    
        const verified = jwt.verify(token, process.env.PRIVATE_KEY);
        
        const user = await User.findById(verified.userId, {password: 0})
    
        req.user = user 

        next()
    
    }catch(err){
        res.json({err:'error en autenticacion ' + err})
    }
})

module.exports = auth