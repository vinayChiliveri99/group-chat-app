require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const db = require('./app/models');
const { notFound } = require('./app/middlewares/notFound');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes
const authRouter = require('./app/routes/auth.routes');
app.use('/api', authRouter);

const channelRouter = require('./app/routes/channel.routes');
app.use('/api', channelRouter);

const chatRouter = require('./app/routes/chat.routes');
app.use('/api', chatRouter);

// Middleware for handling 404 errors
app.use(notFound);

// Event listener for socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');

  // Set up user's personal socket
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    socket.emit('connected');
  });

  // Join the chat room
  socket.on('join chat', (roomId) => {
    socket.join(roomId);
    console.log('user joined the room', roomId);
  });

  // Broadcast a message to all connected clients except the sender
  socket.on('new message', (newMessageReceived) => {
    socket.broadcast.emit('message received', newMessageReceived);
  });

  // Event listener for disconnections
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
