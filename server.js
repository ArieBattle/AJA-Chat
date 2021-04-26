const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', socket => {
    //welcome a new client
    socket.emit('message', 'Welcome to AJAchat!');
    //show when a client connects
    socket.broadcast.emit('message', 'New user has joined the chat!');
    //show when cleint disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });
    //listen for chat message
    socket.on('chatMessage', (msg) => {
        io.emit('message', msg);
    });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));