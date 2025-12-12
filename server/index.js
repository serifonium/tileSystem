import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v } from '../shared/src/vector.js';
import { Player } from '../shared/src/player.js';
import { changeCurrentMap, currentMap, Map, parseMap, Tile } from '../shared/src/map.js';
import { tx_dirt } from '../shared/src/texture.js';
import { HealthPack, HealthPackSpawner } from '../shared/src/healthpack.js';
import { updateLastTime, updateTime } from '../shared/src/deltaTime.js';
import map2json from "../shared/maps/wayside.json" with { type: 'json' }
import { serverCommunicator } from './serverCommunicator.js';
import { Cart } from '../shared/src/cart.js';

const PORT = 8080;
const TPS = 60;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
    origin: "*", // Allow all origins for development; restrict in production
    methods: ["GET", "POST"]
    }
});

serverCommunicator.Emit = (keyphrase, content) => {
    io.sockets.emit(keyphrase, content)
}

serverCommunicator.GetAllPlayers = () => {
    let playerList = []
    for (const [key, value] of Object.entries(clientInfo)) {
        playerList.push(clientInfo[key])
    }
    return playerList
}

// setup map
//changeCurrentMap(new Map())

changeCurrentMap(parseMap(JSON.stringify(map2json)))

let tempID = currentMap.AddEntity(new HealthPack(v(64*Math.floor(Math.random()*7)+3, 64*2)));
currentMap.AddEntity( new HealthPackSpawner(v(4, 8).multiply(64), 50, 10) )
currentMap.AddEntity( new Cart(v(10, 9).multiply(64), 50, 10) )


var clientInfo = {}

io.on("connection", socket => {
    console.log('A user connected:', socket.id);
    socket.on("onPlayerConnect", function(player) {
        clientInfo[socket.id] = new Player(player.username, v(player.x, player.y));
        clientInfo[socket.id].connectionTime = 0;
        clientInfo[socket.id].id = socket.id
        clientInfo[socket.id].keys = {}

        // sends map, players, id, team to new client
        socket.emit('setupPlayer', {"userId": socket.id, "clients": clientInfo, "currentMap": currentMap.stringify()}) 

        // adds new player to all clients
        io.sockets.emit('addNewPlayer', clientInfo[socket.id])

        // detects change in keys 
        socket.on("currentkeys", (keys) => {
            clientInfo[socket.id].keys = keys
        })

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

        
    })
    socket.on('disconnect', function() {
        delete clientInfo[socket.id]
        io.sockets.emit("removePlayer", socket.id)
        console.log('User disconnected:', socket.id);
    })
})

// UPDATE
var updateTick = 0
setInterval(()=>{
    updateTick++;
    updateTime()

    currentMap.update();

    for (const [key, value] of Object.entries(clientInfo)) {
        clientInfo[key].update()
    }

    updateLastTime();
}, 1000/TPS)

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