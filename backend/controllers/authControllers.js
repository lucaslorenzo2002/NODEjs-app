const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')

//CONEXION A MONGOOSE
const connection = require('../config/mongooseConfig')

//REQUIRE A CLASES DE MONGOOSE
const  UserCrud  = require('../container/usersContainer');
const generateToken = require('../jwt');

//CONTENEDOR DE MONGOOSE
const usersContainer = new UserCrud(connection);

//HASH PASSWORD
const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

//REGISTER
const getRegister = asyncHandler(async(req, res) => {

    res.render('register')
})

const postRegister = asyncHandler(async(req, res) => {
    const{ username, password, email, dni, address, phone, lastname, name } = req.body;

    if(!username || !password || !email || !dni || !address || !phone || !lastname || !name){
        return res.status(401).json({error: 'please fill al the gaps'})
    }  

    if(password.length < 8){
        return res.status(401).json({error: 'password must have at least 8 caracters'})
    }

    const userAlredyRegistered = await usersContainer.readUser(username)

    if(userAlredyRegistered){
        return res.status(401).json({error: 'username not available'})
    }

    const newUser = {
        name,
        lastname,
        username, 
        password: hashPassword(password), 
        email, 
        dni, 
        address, 
        phone
    }

    const newUserMDB = await usersContainer.createUser(newUser);

    const accessToken = generateToken(newUserMDB._id);

    res.cookie('token', accessToken,{
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 864),
        sameSite: 'none',
        secure: true
    })

    res.status(200).redirect('/api/users/home')
})

//LOGIN
const getLogin = asyncHandler(async(req, res) => {

    res.render('login')
})

const postLogin = asyncHandler(async(req, res) => {
    const { username, password } = req.body;

    if(!username || !password){
        return res.status(401).json({error: "please fill all the gaps"})
    }

    const user = await usersContainer.readUser(username);

    const correctPassword = await bcrypt.compare(password, user.password);

    if(!user || !correctPassword){
        return res.status(401).json({error: 'username or password incorrect'})
    }

    const accessToken = generateToken(user._id);

    res.cookie('token', accessToken,{
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 864),
        sameSite: 'none',
        secure: true
    })

    res.status(200).redirect('/api/users/home')
})

module.exports = {
    getRegister,
    postRegister,
    getLogin,
    postLogin
}



