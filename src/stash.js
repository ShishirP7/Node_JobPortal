stash 
const express = require("express");
require("dotenv").config();
const cors = require("cors")
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 5000;
const http = require('http');
const socketIo = require('socket.io');
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

//  process JSON Request
app.use(express.json({}));
//  process JSON Requestw
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cors())
const db = require("./db/dbconfig");
app.use("/", require("./routes/router"));
app.use(express.json());



//socket io
const server = http.createServer(app);
const io = socketIo(server);
const Message = require("./models/message_Model")

//socket io

  // Set up Socket.IO connection
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  // Listen for 'join' event
  socket.on('join', (room) => {
    socket.join(room);
  });

  // Listen for 'send_message' event
  socket.on('send_message', async (data) => {
    // Save the message to the database
    const message = new Message({
      from: data.from,
      to: data.to,
      text: data.text,
      timestamp: new Date(),
    });
    await message.save();

    // Send the message to all clients in the chat room
    io.to(data.room).emit('receive_message', data);
  });

  // Listen for 'disconnect' event
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


//socket io end






//start server
app.listen(port, () => {
  console.log(`Server is up and running in port ${port}`);
  db.mongooseConnect(process.env.MONGOURL)
    .then(() => {
      console.log("DB connection Successfull");
    })
    .catch((err) => {
      console.log(err);
    });
});
//start server
