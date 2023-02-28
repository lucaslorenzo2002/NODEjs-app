const { getData, updateData, getLogout, deleteUser } = require('../controllers/userControllers');
const userRouter = require('./router');
const auth = require('../middlewares/auth');


//VER DATOS
userRouter.get('/home', auth, getData)

//UPDATE
userRouter.put('/updateprofile', auth, updateData)

//ROOT
userRouter.get('/', auth, getData)

//LOGOUT
userRouter.get('/logout', getLogout)

userRouter.delete('/:id', deleteUser)

module.exports = userRouter