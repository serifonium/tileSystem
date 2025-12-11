import { Player, player } from "./player.js";
import { v } from "./vector.js";

class MultiplayerHandler {
    constructor(serverURL) {
        this.serverURL = serverURL
        this.socket = io(serverURL, {
            withCredentials: false,
            origin: "*"
        })
        this.players = []
        
        this.socket.on('setupPlayer', (cache)=>{
            // set player id
            player.id = cache.userId;

            // change map
            //changeCurrentMap(loadMap(cache.currentMap));

            // add other players
            for (const [key, value] of Object.entries(cache.clients)) {
                if(player.id !== key) {
                    this.players.push(new Player(value.username, value.pos))
                    this.players[this.players.length - 1].id = value.id
                    console.log("connected player: "+value.id)
                }
            }
        })

        this.socket.on('addNewPlayer', (newPlayer)=>{
            if(newPlayer.id != player.id) {
                console.log("SERVER: add player", newPlayer.id)
                this.players.push(new Player(newPlayer.username, newPlayer.pos))
                this.players[this.players.length - 1].id = newPlayer.id
            }
        })

        this.socket.on("updatePos", (cache) => {
            let player_ = this.GetPlayerById(cache.id)
            if(!player_) return;
            // console.log(player_, cache)

            // update pos and vel
            player_.pos = v(cache.pos.x, cache.pos.y)
        })

        this.socket.on('removePlayer', (id)=>{
            console.log("SERVER: remove player", id)
            for(let p in this.players) {
                if(id == this.players[p].id) {
                    this.players.splice(p, 1)
                    return;
                }
            }
        })
    }
    AskForUser() {
        //let user = prompt("Please enter a username");
        let user = Math.floor(Math.random()*1000);
        if (user != null) {
            if (user == "" || user.length > 30) {
                alert("Username is too long or invaild")
                this.AskForUser();
            } else {
                player.username = user;
                //fconsole.log("..." + socket.id)
                this.socket.emit("onPlayerConnect", { username: user, x: player.pos.x, y: player.pos.y })
            }
        } else {
            this.AskForUser()
        }
    }
    GetPlayerById(id) {
        for(let player_ of this.players) {
            if(player_.id == id) return player_;
        }
    }
    UpdatePosition() {
        this.socket.emit("updatePos", {"pos": player.pos})
    }
    renderPlayers() {
        for(let player_ of this.players) {
            player_.render()
        }
    }
}

var multiplayerHandler = new MultiplayerHandler("http://localhost:8080")

export { multiplayerHandler }