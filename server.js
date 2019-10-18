const express = require('express');
const app = express();
var server = require ('http').Server(app)
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log("A new user connected")
    socket.emit('test event', 'New Data');
});

server.listen(3000, ()=>{
    console.log("Socket.io server is listening on port 3000")
})