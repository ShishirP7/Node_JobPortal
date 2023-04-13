// Import necessary modules
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const MessageModal = require('./models/message_Model');

// Load environment variables
dotenv.config();

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Configure middleware
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));
app.use(express.json());
app.use(cors());

// Set up routes
app.use('/', require('./routes/router'));

// Configure socket.io
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  },
});

// Handle socket.io events
io.on('connection', (socket) => {
  console.log('A user connected');

  // When a user connects to a chat
  socket.on('connectChat', async ({ from, to, isJobSeeker }) => {
    const room = isJobSeeker ? `jobseeker:${from}-${to}` : `employer:${from}-${to}`;

    socket.join(room);

    io.to(room).emit('connected_to_room', { room });
  });

  // When a user sends a chat message
  socket.on('chat_message', async ({ from, to, text, isJobSeeker, timestamp }) => {
    const room = isJobSeeker ? `jobseeker:${from}-${to}` : `employer:${from}-${to}`;

    const message = new MessageModal({ from, to, text, timestamp });
    await message.save();

    io.to(room).emit('chat_message', { from, to, text, timestamp });
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Connect to the database and start the server
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
