const PORT = 8080;

const io = require('socket.io')(PORT, {
    cors : {
        // origin : ["http://localhost:3001", "http://127.0.0.1:5500"],
        // methods: ["GET", "POST"],
        // credentials : false
    }
})
console.log("up!")

io.on("connection", socket => {
    console.log(socket)
    socket.on('disconnect', function() {
        console.log("disconnect")        
    })
})