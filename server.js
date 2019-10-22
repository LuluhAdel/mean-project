// const express = require('express');
// const app = express();
// var server = require ('http').Server(app)
// var io = require('socket.io')(server);
// app.use(express.static(__dirname+'mean-project/dist/mean-project'))

// io.sockets.on('connection', function(socket){
//     console.log("A new user connected");

// socket.on('room', function(data){
//         //joining
        
//         socket.join(data); 
//         console.log(data + 'joined by code: '+data)
//     })
// })

// room = "123";
// io.sockets.in(room).emit('message',"hello to ");


// io.sockets.in('foober').emit('message',"hello there ");



// server.listen(3000, ()=>{
//     console.log("Socket.io server is listening on port 3000");

    
// })

const express = require('express');
const app = express();
var server = require ('http').Server(app)
var io = require('socket.io')(server);
app.use(express.static(__dirname+'mean-project/dist/mean-project'))

io.on('connection', function(socket){
    console.log("A new user connected");

socket.on('join', function(data){
        //joining
        
        socket.join(data.code); 
        console.log(data.user + 'joined by code: '+data.code)
        //new user broadcast
        io.sockets.in(data.code).emit('new user joined', {user: data.user, message:'has joined this challenge'})
    })

socket.on('message', function(data){
    io.sockets.in(data.code).emit('new message', {user: data.user, message: data.message})
})

});

server.listen(3000, ()=>{
    console.log("Socket.io server is listening on port 3000");

    
})

 