const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');

const notificationRoute = require('./routes/notification');

const app = express();
require('dotenv').config();

app.use( cors() );
app.use( express.json() );

app.use('/api/notification', notificationRoute);

const PORT = process.env.PORT || 3000;
const server = app.listen( PORT , () => {
    console.log("SERVER STARTED IN PORT: ", PORT);
});

const io = socketio( server, {
    cors: {
        origin: '*'
    }
} );

let users = [];

io.on('connection', socket => {

    socket.on('user-connect', ({ name, latitude, longitude }, callback ) => {

        const newUser = { id: new Date().getTime() * 0.0010 , name, coords: { latitude, longitude } };
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
