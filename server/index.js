import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v } from '../shared/src/vector.js';
import { Player } from '../shared/src/player.js';
import { Map, Tile } from '../shared/src/map.js';
import { tx_dirt } from '../shared/src/texture.js';
import { HealthPack } from '../shared/src/healthpack.js';

const PORT = 8080;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
    origin: "*", // Allow all origins for development; restrict in production
    methods: ["GET", "POST"]
    }
});

// setup map
var currentMap = new Map()
currentMap.SetTile(v(0, 0), v(50, 50), new Tile(tx_dirt, undefined, undefined))

let tempID = currentMap.AddEntity(new HealthPack(v(64*Math.floor(Math.random()*7)+3, 64*2)));
console.log(currentMap.GetEntityByID(tempID))

var clientInfo = {}

io.on("connection", socket => {
    console.log('A user connected:', socket.id);
    socket.on("onPlayerConnect", function(player) {
        clientInfo[socket.id] = new Player(player.username, v(player.x, player.y));
        clientInfo[socket.id].connectionTime = 0;
        clientInfo[socket.id].id = socket.id

        //sends map, players, id, team to new client
        socket.emit('setupPlayer', {"userId": socket.id, "clients": clientInfo, "currentMap": currentMap.stringify()}) 

        // update position when requested
        socket.on("updatePos", (cache) => {
            clientInfo[socket.id].pos = cache.pos
            io.sockets.emit("updatePos", {"id": socket.id, "pos": cache.pos})
        })

        // add entity when requested
        socket.on("addEntity", (obj)=>{
            console.log(Map._ObjToEntity_(obj))
            currentMap.AddEntity(Map._ObjToEntity_(obj), obj.id)
            io.sockets.emit("addEntity", obj)
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

// open server
httpServer.listen(PORT, () => {
    console.log(`Server listening on *:${PORT}`);
});

// status logging
setInterval(()=>{
    console.log("*-----*")
    for (const [key, value] of Object.entries(clientInfo)) {
        console.log(`* [${value.username}] as ${key}`)
    }
}, 1000*10)