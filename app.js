const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');

app.use( cors() );

const server = http.createServer( app );

const io = socketio( server, {
    cors: {
        origin: '*'
    }
} );

let users = [];

io.on('connection', socket => {

    socket.on('user-connect', ({ name, latitude, longitude }, callback ) => {

        console.log("USER CONNECTED");

        const newUser = { id: new Date().getTime() * 0.0010 , name, coords: { latitude, longitude } };
        console.log(newUser)
        users.push( newUser );

        callback( newUser );
        io.emit('users', users);
    })

    socket.on('user-coords', ({ id, latitude, longitude }) => {
        console.log({ latitude, longitude });

        users = users.map( u => {
            if( u.id === id ){
                u.coords.latitude = latitude;
                u.coords.longitude = longitude;
                console.log(u)
                return u;
            }
            return u;
        })

        console.log(users)

        io.emit('users', users);
    });

    socket.on('user-disconnect', (id, callback) => {
        users = users.filter( u => u.id !== id);
        callback({
            message: "SE DESCONECTO DEL SERVIDOR"
        })

        io.emit('users', users);
    })

    io.emit('users', users);
});

const PORT = process.env.PORT || 3000;

server.listen( PORT , () => {
    console.log("SERVER STARTED IN PORT: ", 3000);
});