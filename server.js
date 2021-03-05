const express = require('express');
const socketio = require ('socket.io');

const port = 3000;
const index = "/index.html"
const server = express()
    .use((req, res) => {res.sendFile(index, { root: __dirname });})
    .listen(port, () => console.log('Server has started at port 3000'));

const io = socketio(server);

let users = [];

io.on('connection', (socket) => {
    socket.on('username', (username) => {
        console.log(username);

        socket.username = username;
        users.push(socket);
    });
});
