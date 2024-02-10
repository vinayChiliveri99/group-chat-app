const router = require('express').Router();
const chatController = require('../controller/chat.controller');
const authJwt = require('../middlewares/authJwt');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// 1. create chat.
router.post('/chats', authJwt.verifyToken, chatController.addChat);

// 2. get chats
router.get('/chats', authJwt.verifyToken, chatController.getChats);

module.exports = router;
