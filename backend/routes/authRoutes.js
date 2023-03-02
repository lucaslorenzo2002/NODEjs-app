const { getRegister, postRegister, getLogin, postLogin, getForgotPassword, postForgotPassword, getResetPassword, resetPassword } = require('../controllers/authControllers');
const authRouter = require('./router');

//REGISTER
authRouter.get('/register', getRegister)
authRouter.post('/register', postRegister)

//LOG IN
authRouter.get('/login', getLogin)
authRouter.post('/login', postLogin)

//FORGOT PASSWORD
authRouter.get('/forgotpassword', getForgotPassword)
authRouter.post('/forgotpassword', postForgotPassword)

//RESET PASSWORD
authRouter.get('/resetpassword/:restToken', getResetPassword)
authRouter.put('/resetpassword/:restToken', resetPassword)

module.exports = authRouter