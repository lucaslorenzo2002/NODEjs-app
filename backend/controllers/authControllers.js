const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt')
const crypto = require('crypto')

//CONEXION A MONGOOSE
const connection = require('../config/mongooseConfig')

//REQUIRE A CLASES DE MONGOOSE
const  UserCrud  = require('../container/usersContainer');
const generateToken = require('../jwt');

const Token = require('../schemas/tokenModel');
const sendEmail = require('../utils/sendEmail');

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

//FORGOT PASSWORD
const getForgotPassword = asyncHandler(async (req, res) => {

    res.render('forgotPassword')
})

const postForgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await usersContainer.readUserByMail(email);

    if(!user){
        res.status(404)
        res.json({err: 'user not found'})
    }

    let token = await Token.findOne({ userId: user._id });
    if (token) {
    await token.deleteOne();
  }

    let resetToken = crypto
    .randomBytes(32)
    .toString('hex')
    + user._id

    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest('hex')

    await new Token({
        userId: user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 1000) 
    }).save()


    let resetUrl =  `${process.env.FRONTEND_URL}/resetpassword/${hashedToken}}`

    let message = `
    <h2>HELLO ${user.username}!</h2>
    <p>use the below url in order to reset the password</p>
    <p>the link is valid for only 30 minutes</p> 
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    <p>Regards...</p>
    `

    let from = process.env.EMAIL_USER;

    let to = user.email;

    let subject = `<p>Reset password email</p>`;

    try {
        await sendEmail(from, to, subject, message)
        res.status(200).json({success: true, message: 'Reset email sent'})
    } catch (error) {
        res.status(500)
        throw new Error ('email not sent, try again')
    }

})

//RESET PASSWORD
const getResetPassword = asyncHandler(async (req, res) => {

    res.render('resetPassword')
})

const resetPassword = asyncHandler(async (req, res) => {
    const {newPassword} = req.body;
    const{confirmNewPassword} = req.body;
    const {resetToken} = req.params;

    if(newPassword !== confirmNewPassword){
        return res.json({error: 'passwords do not match'})
    }

    const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest('hex')

    const userToken = Token.findOne({
        token: hashedToken,
        expiresAt: {$gt: Date.now()}
    })
    console.log(userToken);

    if(!userToken){
        res.status(404)
        throw new Error ('token expired')
    }

    const user = await usersContainer.readUserById({_id: userToken.userId})
    user.password = newPassword
    await user.save()

    res.status(200).json({success: 'password reset successful'})
})

module.exports = {
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    resetPassword
}
