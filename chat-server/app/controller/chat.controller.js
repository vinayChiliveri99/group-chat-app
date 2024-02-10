const db = require('../models');

const Channel = db.channel;
const User = db.user;
const UsersOnChannel = db.usersOnChannel;

// 1. get all chats of that channel.

const getChats = async (req, res) => {
  try {
    // Assuming you have a channelId in the request
    const { channelId } = req.query;

    console.log(channelId);

    // Fetch chats for the given channel
    const chats = await db.chat.findAll({
      where: {
        channelId: channelId,
      },
      include: [
        {
          model: db.user,
          attributes: ['id', 'username'],
        },
      ],
    });

    // Respond with the fetched chats
    res.status(200).json({ chats });
  } catch (error) {
    // Handle errors
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 2. add chat to a channel

const addChat = async (req, res) => {
  try {
    // Extract necessary data from the request body
    const userId = req.userId;
    const { content, channelId } = req.body;

    // Create a new chat entry in the database
    const newChat = await db.chat.create({
      content,
      authorId: userId,
      channelId: channelId,
    });

    // Fetch user details for the author of the chat
    const user = await db.user.findByPk(userId, {
      attributes: ['id', 'username'],
    });

    // Respond with the newly created chat along with user details
    res
      .status(201)
      .json({ chat: { ...newChat.toJSON(), User: user.toJSON() } });
  } catch (error) {
    // Handle errors
    console.error('Error adding chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getChats, addChat };
