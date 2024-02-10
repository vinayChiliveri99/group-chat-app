const db = require('../models');
const config = require('../config/auth.config');

const User = db.user;
const Channel = db.channel;
const UsersOnChannel = db.usersOnChannel;

const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. User registration endpoint

exports.signup = async (req, res) => {
  // Destructure the request body.
  const { username, email, password } = req.body;

  // validate if user sending all fields are not.
  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ message: 'All fields are required' });
  }

  try {
    // Check if the welcome channel exists
    let welcomeChannel = await Channel.findOne({
      where: { name: 'Welcome' },
    });

    // console.log(welcomeChannel);

    // Save user to the database.
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    // Associate the user with the "Welcome" channel
    await UsersOnChannel.create({
      userId: user.id,
      channelId: welcomeChannel.id,
    });

    res.status(200).send({
      message: 'User registered successfully',
      welcomeId: welcomeChannel.id,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send({ message: error.message });
  }
};

// 2. User login endpoint
exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }

      // Compare the provided password with the stored hashed password.
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid password!',
        });
      }

      // Generate a JWT token for the authenticated user.
      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: '10d',
      });

      // Send the user details and token in the response.
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken: token,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// 3. get users based on search.

exports.getUsers = (req, res) => {
  const keyword = req.query.search;
  // console.log(req.userId);
  // console.log(keyword);

  const currentUserId = req.userId;
  // Define the where clause for the query
  const whereClause = keyword
    ? {
        [Op.and]: [
          // Exclude the current user
          { id: { [Op.not]: currentUserId } },
          {
            [Op.or]: [
              // Case-insensitive search on username and email
              { username: { [Op.iLike]: `%${keyword}%` } },
              { email: { [Op.iLike]: `%${keyword}%` } },
            ],
          },
        ],
      }
    : { id: { [Op.not]: currentUserId } };

  const attributes = {
    exclude: ['password', 'createdAt', 'updatedAt'],
  };

  User.findAll({
    where: whereClause,
    attributes: attributes,
  })
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
};
