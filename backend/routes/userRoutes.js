const { getData, getLogout, getUpdateData, postUpdateData, getHome } = require('../controllers/userControllers');
const userRouter = require('./router');
const auth = require('../middlewares/auth');


//DATA
userRouter.get('/home', auth, getHome)
userRouter.get('/data-json', auth, getData)

//UPDATE
userRouter.get('/updateprofile', auth, getUpdateData)
userRouter.post('/updateprofile', auth, postUpdateData)

//ROOT
userRouter.get('/', auth, getHome)

//LOGOUT
userRouter.get('/logout', getLogout)

module.exports = userRouter