const db = require('../models');

const Channel = db.channel;
const User = db.user;
const UsersOnChannel = db.usersOnChannel;

// 1. get all channels with current user.

const getChannels = async (req, res) => {
  try {
    const userId = req.userId;

    // First, check if the user exists.
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'No user found!' });
    }

    // fetch all entries in the usersOnChannel table where userId matches
    const userChannels = await UsersOnChannel.findAll({
      where: {
        userId: userId,
      },
    });

    // extract channelIds from the userChannels
    const channelIds = userChannels.map(
      (channel) => channel.channelId
    );

    // fetch all channels associated with the current user
    const channels = await Channel.findAll({
      where: {
        id: channelIds,
      },
    });

    res.status(200).json(channels);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({
      message: 'Error fetching channels',
      error: error.message,
    });
  }
};

// 2. create new channel.

const addChannel = async (req, res) => {
  try {
    // Validate request
    if (!req.body.name && !req.body.description) {
      return res.status(400).json({
        message: 'Channel name and description cannot be empty!',
      });
    }

    const { name, description } = req.body;

    // Check if the user exists in the database
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'No user found!' });
    }

    // check if a channel exist with same name.
    const prevChannel = await Channel.findOne({
      where: {
        name: name,
        groupAdmin: req.userId,
      },
    });

    if (prevChannel) {
      return res
        .status(500)
        .json({ message: 'Channel name should be unique' });
    }

    // Create the channel
    const createdChannel = await Channel.create(
      {
        name: name,
        description: description,
        groupAdmin: req.userId,
      },
      {
        fields: ['name', 'description', 'groupAdmin'],
      }
    );

    // Check if the channel was created successfully
    if (!createdChannel) {
      return res.status(500).json({
        message: 'Failed to create the Channel.',
      });
    }

    // Associate the user with the channel
    await UsersOnChannel.create({
      userId: req.userId,
      channelId: createdChannel.id,
    });

    // Fetch the created channel with associated user data
    const result = await Channel.findOne({
      where: { id: createdChannel.id },
      // include: { model: User, attributes: ['id', 'username'] },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({
      message:
        error.message ||
        'Some error occurred while creating the Channel.',
    });
  }
};

// 3. add a user to the channel

const addUserToChannel = async (req, res) => {
  try {
    const { username, channelId } = req.body;

    // Find the user by their username
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // Check if the channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found!' });
    }

    // Check if the user is the group admin of the channel
    if (channel.groupAdmin !== req.userId) {
      return res.status(403).json({
        message: 'Only the group admin can add users to the channel!',
      });
    }

    // Associate the user with the channel
    await UsersOnChannel.create({
      userId: user.id,
      channelId: channelId,
    });

    res.status(200).json({
      message: 'User added to channel successfully!',
      username: username,
    });
  } catch (error) {
    console.error('Error adding user to channel:', error);
    res.status(500).json({
      message: 'Error adding user to channel',
      error: error.message,
    });
  }
};

// const addUserToChannel = async (req, res) => {
//   try {
//     const { usernames, channelId } = req.body;

//     // Check if the channel exists
//     const channel = await Channel.findByPk(channelId);
//     if (!channel) {
//       return res.status(404).json({ message: 'Channel not found!' });
//     }

//     // Check if the user is the group admin of the channel
//     if (channel.groupAdmin !== req.userId) {
//       return res.status(403).json({
//         message: 'Only the group admin can add users to the channel!',
//       });
//     }

//     // Iterate over the array of usernames
//     for (const username of usernames) {
//       // Find the user by their username
//       const user = await User.findOne({
//         where: {
//           username: username,
//         },
//       });

//       // Check if the user exists
//       if (!user) {
//         console.error('User not found:', username);
//         continue;
//       }

//       // Associate the user with the channel
//       await UsersOnChannel.create({
//         userId: user.id,
//         channelId: channelId,
//       });

//       console.log(
//         `User "${username}" added to channel successfully!`
//       );
//     }

//     res
//       .status(200)
//       .json({ message: 'Users added to channel successfully!' });
//   } catch (error) {
//     console.error('Error adding users to channel:', error);
//     res.status(500).json({
//       message: 'Error adding users to channel',
//       error: error.message,
//     });
//   }
// };

// 4. get members on the channel

const getMembersOnChannel = async (req, res) => {
  try {
    // const channelId = req.body.channelId;
    const channelId = req.query.channelId;

    const userId = req.userId;

    if (!channelId) {
      return res
        .status(400)
        .json({ message: 'Channel id should not be empty' });
    }

    // Check if the current user is part of the channel
    const userOnChannel = await UsersOnChannel.findOne({
      where: { userId: userId, channelId: channelId },
    });
    if (!userOnChannel) {
      return res
        .status(400)
        .json({ message: 'User does not belong to this channel' });
    }

    // Fetch all users associated with the channel
    const allUsers = await UsersOnChannel.findAll({
      where: { channelId: channelId },
    });

    // Extract user IDs from the fetched data
    const userIds = allUsers.map((user) => user.userId);

    // Fetch usernames of the users associated with the channel
    const users = await User.findAll({
      where: { id: userIds },
      attributes: ['username'],
    });

    // Extract usernames from the fetched data
    const usernames = users.map((user) => user.username);

    // Send the usernames as the response
    res.status(200).json({ members: usernames });
  } catch (error) {
    console.error('Error fetching members on channel:', error);
    res.status(500).json({
      message: 'Error fetching members on channel',
      error: error.message,
    });
  }
};

// 5. remove a user from a channel
const removeUserFromChannel = async (req, res) => {
  try {
    const { userId, channelId } = req.body;

    // Check if the channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found!' });
    }

    // Check if the user is the group admin of the channel
    if (channel.groupAdmin !== req.userId) {
      return res.status(403).json({
        message:
          'Only the group admin can remove users from the channel!',
      });
    }

    // Check if the user to remove is in the channel
    const userOnChannel = await UsersOnChannel.findOne({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });
    if (!userOnChannel) {
      return res
        .status(404)
        .json({ message: 'User not found in the channel!' });
    }

    // Remove the user from the channel
    await UsersOnChannel.destroy({
      where: {
        userId: userId,
        channelId: channelId,
      },
    });

    res
      .status(200)
      .json({ message: 'User removed from channel successfully!' });
  } catch (error) {
    console.error('Error removing user from channel:', error);
    res.status(500).json({
      message: 'Error removing user from channel',
      error: error.message,
    });
  }
};

// 6. delete a channel

const deleteChannel = async (req, res) => {
  try {
    const { channelId } = req.body;

    // Check if the channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ removedChannel: null });
    }

    // Check if the user is the group admin of the channel
    if (channel.groupAdmin !== req.userId) {
      return res.status(403).json({
        removedChannel: null,
        message: 'Only the group admin can delete the channel!',
      });
    }

    // Remove all users associated with the channel from UsersOnChannel table
    await UsersOnChannel.destroy({
      where: {
        channelId: channelId,
      },
    });

    // Delete the channel
    await Channel.destroy({
      where: {
        id: channelId,
      },
    });

    res.status(200).json(channel);
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({
      removedChannel: null,
      message: 'Error deleting channel',
      error: error.message,
    });
  }
};

// 7. rename a channel
const renameChannel = async (req, res) => {
  try {
    const { channelId, name, description } = req.body;

    // Check if the channel exists
    const channel = await Channel.findByPk(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found!' });
    }

    // Check if the user is the group admin of the channel
    if (channel.groupAdmin !== req.userId) {
      return res.status(403).json({
        message: 'Only the group admin can rename the channel!',
      });
    }

    // Update the channel with the new name or description or both
    await channel.update({
      name: name || channel.name,
      description: description || channel.description,
    });

    res
      .status(200)
      .json({ message: 'Channel renamed successfully!' });
  } catch (error) {
    console.error('Error renaming channel:', error);
    res.status(500).json({
      message: 'Error renaming channel',
      error: error.message,
    });
  }
};

const getChannelDetails = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.query.id;

    // console.log(name);

    // First, check if the user exists.
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'No user found!' });
    }

    const details = await Channel.findOne({
      where: {
        id: id,
      },
    });

    res.status(200).json(details);
  } catch (error) {
    console.error('Error fetching channel details:', error);
    res.status(500).json({
      message: 'Error fetching channel details',
      error: error.message,
    });
  }
};

module.exports = {
  addChannel,
  getChannels,
  addUserToChannel,
  getMembersOnChannel,
  removeUserFromChannel,
  deleteChannel,
  renameChannel,
  getChannelDetails,
};
