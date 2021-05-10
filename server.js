//this is the startup for putting html in js file
//var div = document.createElement('div');
//div.setAttribute('class', 'someClass');
//div.innerhtml = document.getElementById('page').inner.HTML;
//document.getElementById('wrapper').style.property = new style;

//<script id="page" type="text/html">
//<div id="page" class="wholePage">

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messageFormat = require('./Utilities/message');
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./Utilities/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));
const botName = 'AJAchat Bot';
//run when client connects
io.on('connection', socket => {
    socket.on('typing', function (data) {
        console.log(data);
        socket.broadcast.emit('typing', data);
      });
      
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

    //welcome a new client
    socket.emit('message', messageFormat(botName, 'Welcome to AJAchat!'));

    //show when a client connects
    socket.broadcast.to(user.room)
    .emit('message', messageFormat(botName,`${user.username} has joined the chat!`)
    );
    //send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room, 
        users: getRoomUsers(user.room)
        });
    });
    

    //listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', messageFormat(user.username, msg));
    });
    //show when cleint disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
        if(user) {
            io.to(user.room)
            .emit('message', messageFormat(botName, `${user.username} has left the chat`));

            //send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room, 
                users: getRoomUsers(user.room)
        });
      }   
   });    
});

//to be able to run on a local machine'
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//</div>
//</script>
