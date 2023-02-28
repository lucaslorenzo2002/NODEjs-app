const { getChat, deleteMessage } = require('../controllers/messageControllers');
const auth = require('../middlewares/auth');
const messageRouter = require('./router');

messageRouter.get('/chat', auth, getChat)

messageRouter.delete('/chat/:id', auth, deleteMessage)

module.exports = messageRouter