const express = require('express');
const socketio = require ('socket.io');

const port = process.env.PORT || 3000;
const index = "/index.html"
const server = express()
    .use((req, res) => {res.sendFile(index, { root: __dirname });})
    .listen(port, () => console.log('Server has started at port 3000'));

const io = socketio(server);

let users = [];
let timeout = null;
let currentPlayer = null;

io.on('connection', (socket) => {
    socket.on('username', (username) => {
        console.log(username);

        socket.username = username;

        if (users.lenght === 0) {
            currentPlayer = socket;
            users.push(socket);
            switchPlayer()
        }else {
            users.push(socket);
        }


        sendUsers();
    });

    socket.on('line', (data) => {
        socket.broadcast.emit('line', data);
    });
});

io.on('disconnect', () => {
    console.log(`${socket.username} has left`);
    users = users.filter((user) => {
        return user !== socket;
    });

    sendUsers();
});

function sendUsers() {
    io.emit('users', users.map((user) => {
        return {
            username: user.username,
            active: user === currentPlayer
        }
    }));
}

function switchPlayer () {
    const indexCurrentPlayer = users.indexOf(currentPlayer);
    currentPlayer = users[(indexCurrentPlayer + 1) % users.lenght];
    sendUsers();

    io.emit('clear');
}

timeout = setTimeout(switchPlayer, 5000);
