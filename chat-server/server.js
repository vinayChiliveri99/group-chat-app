require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./app/models');
const { notFound } = require('./app/middlewares/notFound');

const app = express();

var corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the application.' });
});

// creating "Welcome" channel upon server initialization
const createWelcomeChannel = async () => {
  try {
    await db.sequelize.sync({ force: false });
    const welcomeChannel = await db.channel.findOne({
      where: { name: 'Welcome' },
    });

    if (!welcomeChannel) {
      await db.channel.create({
        name: 'Welcome',
        description:
          'This is welcome group, a default channel for new users',
      });
    }
  } catch (error) {
    console.error('Error creating "Welcome" channel:', error);
  }
};

createWelcomeChannel();

// routes
const authRouter = require('./app/routes/auth.routes');
app.use('/api', authRouter);

const channelRouter = require('./app/routes/channel.routes');
app.use('/api', channelRouter);

const chatRouter = require('./app/routes/chat.routes');
app.use('/api', chatRouter);

// for any other routes
app.use(notFound);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// const io = require('socket.io')(server, {
//   corsOptions,
//   pingTimeout: 60000,
// });

// io.on('connection', (socket) => {
//   console.log('connected to socket.io');
// });

// pending with socket.io
