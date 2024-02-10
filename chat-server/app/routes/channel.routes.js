const router = require('express').Router();
const channelController = require('../controller/channel.controller');
const authJwt = require('../middlewares/authJwt');

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

// 1. create a channel.
router.post(
  '/channels',
  authJwt.verifyToken,
  channelController.addChannel
);

// 2. get all channels.
router.get(
  '/channels',
  authJwt.verifyToken,
  channelController.getChannels
);

// 3. add user to a channel.

router.post(
  '/channels/addUser',
  authJwt.verifyToken,
  channelController.addUserToChannel
);

// 4. get all members in a channel
router.get(
  '/channels/members',
  authJwt.verifyToken,
  channelController.getMembersOnChannel
);

// 5. remove a user from channel
router.delete(
  '/channels/member',
  authJwt.verifyToken,
  channelController.removeUserFromChannel
);

// 6. delete a channel
router.delete(
  '/channels',
  authJwt.verifyToken,
  channelController.deleteChannel
);

// 7. rename a channel.

router.put(
  '/channels',
  authJwt.verifyToken,
  channelController.renameChannel
);

// 8. get channel details
router.get(
  '/channelDetails',
  authJwt.verifyToken,
  channelController.getChannelDetails
);

module.exports = router;
