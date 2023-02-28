const { getRegister, postRegister, getLogin, postLogin } = require('../controllers/authControllers');
const authRouter = require('./router');

//REGISTRO
authRouter.get('/register', getRegister)
authRouter.post('/register', postRegister)

//INICIAR SESION
authRouter.get('/login', getLogin)
authRouter.post('/login', postLogin)

module.exports = authRouter