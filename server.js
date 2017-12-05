var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var shortid = require('shortid');
users = [];
connections = [];

server.listen(3000);
console.log('ChatServer running...')

io.sockets.on('connection', function(socket){

    connections.push(socket);

    console.log('Connected: %s sockets connected', connections.length);

    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username),1)
        connections.splice(connections.indexOf(socket), 1);
    })

    socket.on('send-message', function(data){
        console.log(data);
        io.sockets.emit('new-message', {user: socket.username, message:  data.message});
    });

    socket.on('new-user', function(data, callback){
        socket.username = 'Guest' + shortid.generate();
        users.push(socket.username)
        updateUsers();
        socket.emit('user-registered', {username: socket.username})

    });

    socket.on('update-user', function(data){
        users[users.indexOf(socket.username)] = data;
        socket.username = data;
        updateUsers();
    });

    function updateUsers(){
        io.sockets.emit('get-users', users);
    }
});



