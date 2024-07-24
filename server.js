const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGroup', (groupId) => {
    socket.join(groupId);
    console.log(`Client joined group ${groupId}`);
  });

  socket.on('leaveGroup', (groupId) => {
    socket.leave(groupId);
    console.log(`Client left group ${groupId}`);
  });

  socket.on('sendMessage', (data) => {
    const { message, userName, timestamp, groupId } = data;
    console.log('Message received on server:', data); // Verifica los datos recibidos
    io.to(groupId).emit('message', { message, userName, timestamp, groupId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});