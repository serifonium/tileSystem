import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v } from '../shared/src/vector.js';
import { Player } from '../shared/src/player.js';

const PORT = 8080;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
    origin: "*", // Allow all origins for development; restrict in production
    methods: ["GET", "POST"]
    }
});

var clientInfo = {}

io.on("connection", socket => {
    console.log('A user connected:', socket.id);
    socket.on("onPlayerConnect", function(player) {
        clientInfo[socket.id] = new Player(player.username, v(player.x, player.y));
        clientInfo[socket.id].connectionTime = 0;
        clientInfo[socket.id].id = socket.id

        //sends map, players, id, team to new client
        socket.emit('setupPlayer', {"userId": socket.id, "clients": clientInfo}) 

        socket.on("updatePos", (cache) => {
            //console.log(cache)
            clientInfo[socket.id].pos = cache.pos
            io.sockets.emit("updatePos", {"id": socket.id, "pos": cache.pos})
        })

        // adds new player to all clients
        io.sockets.emit('addNewPlayer', clientInfo[socket.id])
    })
    socket.on('disconnect', function() {
        delete clientInfo[socket.id]
        io.sockets.emit("removePlayer", socket.id)
        console.log('User disconnected:', socket.id);
    })
})

httpServer.listen(PORT, () => {
    console.log(`Server listening on *:${PORT}`);
});

setInterval(()=>{
    console.log("*-----*")
    for (const [key, value] of Object.entries(clientInfo)) {
        console.log(`* [${value.username}] as ${key}`)
    }
}, 1000*10)