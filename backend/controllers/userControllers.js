const asyncHandler = require('express-async-handler');

//CONEXION A MONGOOSE
const connection = require('../config/mongooseConfig')

//REQUIRE A CLASES DE MONGOOSE
const  UserCrud  = require('../container/usersContainer');

//CONTENEDOR DE MONGOOSE
const usersContainer = new UserCrud(connection);


//VER DATOS
const getData = asyncHandler(async(req, res) => {

    /* const user = await usersContainer.readUserById(req.user._id)

    if(user){ */
        res.status(200).render('dashboard')
    /* }else{
        res.status(401).json({error: 'not authenticated'})
    }   */
})

//UPDATE
const updateData = asyncHandler(async(req, res) => {

    /* const user = await usersContainer.readUserById(req.user._id)
    if(user){ */
        const{ name, lastName, username, phone, address, email } = user
        user.email = email;
        user.name = req.body.name || name;
        user.phone = req.body.phone || phone;
        user.username = req.body.username || username;
        user.lastName = req.body.lastName || lastName;
        user.address = req.body.address || address;

        const updatedUser = await user.save()

        res.status(200).json({
            id: updatedUser._id, 
            name: updatedUser.name,
            username: updatedUser.username,
            lastname: updatedUser.lastName,
            email: updatedUser.email,
            address: updatedUser.address,
            phone: updatedUser.phone
        })
   /*  }else{
        res.status(401).json({error: 'user not found'})
    } */
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

//DELETE USER
const deleteUser = asyncHandler(async(req, res) => {

    const id = parseInt(req.params.id);

    await usersContainer.deleteUser(id)

    res.json({proceso: 'ok'})
})

module.exports = {
    getData,
    getLogout,
    deleteUser,
    updateData
}