const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const typing = false;
// Username and room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//message from server
const socket = io();

//join chatroom
socket.emit('joinRoom', {username, room});

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    //scroll down every time a new message is sent
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get message text
    const msg = e.target.elements.msg.value;
    //emit message to server
    socket.emit('chatMessage', msg);
    //clear message line
    e.target.elements.msg.value = '';
    //focus on message line after a message is sent
    e.target.elements.msg.focus();
});

//output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
};

//add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}
function typingStopped() {
    typing = false;
    socket.emit(notTyping);
}
function onKeyDown() {
    if(typing == false) {
        typing = true
        socket.emit(typing);
        time = setTimeout(typingstopped, 500);
      } else {
        clear(time);
        time = setTimeout(typingstopped, 500);
      }
    
}