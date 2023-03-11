const asyncHandler = require('express-async-handler');

//CONEXION A MONGOOSE
const connection = require('../config/mongooseConfig')

//REQUIRE A CLASES DE MONGOOSE
const  UserCrud  = require('../container/usersContainer');

//CONTENEDOR DE MONGOOSE
const usersContainer = new UserCrud(connection);


//VER DATOS
const getHome = asyncHandler(async(req, res) => {

    const user = await usersContainer.readUserById(req.user._id)

    res.status(200).render('dashboard', {user})
})

const getData = asyncHandler(async(req, res) => {
    const user = await usersContainer.readUserById(req.user._id)

    res.status(200).json({user})
})

const getUpdateData = asyncHandler(async(req, res) => {

    const user = await usersContainer.readUserById(req.user._id)

    res.render('updateData', {user})
})

const postUpdateData = asyncHandler(async(req, res) => {
    const{username, email, address, phone} = req.body

    await usersContainer.updateUser(req.user._id, username, email, address, phone)
    
    res.redirect('/api/users/home')
})


//LOGOUT
const getLogout = asyncHandler(async(req, res) => {

    res.cookie('token', "",{
        path: '/',
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'none',
        secure: true
    })

    res.status(200).redirect('/api/auth/login')
})


module.exports = {
    getHome,
    getData,
    getLogout,
    getUpdateData,
    postUpdateData
}