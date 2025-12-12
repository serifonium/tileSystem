import { serverCommunicator } from "../../server/serverCommunicator.js";
import { Camera } from "./camera.js";
import { ctx } from "./canvas.js";
import { getDeltaTime } from "./deltaTime.js";
import { HealthComponent } from "./healthComponent.js";
import { InputHandler } from "./inputHandling.js";
import { currentMap } from "./map.js";
import { v } from "./vector.js";

export class Player {
    constructor(username, pos = v(200, 200)) {
        this.username = username
        this.pos = pos
        this.vel = v(0, 0)
        this.movementSpeed = 0.40
        this.scale = v(56)
        this.health = new HealthComponent(150)

        this.keybinds = {
            "up":  ["w"],
            "down": ["s"],
            "left": ["a"],
            "right": ["d"]
        }
    }

    getMiddle() {
        return v(this.pos.x+this.scale.x/2, this.pos.y+this.scale.y/2)
    }

    IsKeybindDown(keybind) {
        for(let key of this.keybinds[keybind]) {
            if(this.keys[key]) return true
        }
        return false
    }

    render() {
        ctx.fillStyle = '#133f9eff'
        ctx.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y)

        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText(this.username, this.pos.x+this.scale.x/2, this.pos.y-16)
    }

    update() {
        // get direction vector
        var directionVector = v(0, 0)
        if(this.IsKeybindDown("up")) directionVector.y += -1
        if(this.IsKeybindDown("down")) directionVector.y += 1
        if(this.IsKeybindDown("left")) directionVector.x += -1
        if(this.IsKeybindDown("right")) directionVector.x += 1

        if(directionVector.x != 0 && directionVector.y != 0) {
            directionVector.x = directionVector.x/Math.sqrt(2)
            directionVector.y = directionVector.y/Math.sqrt(2)
        }
        directionVector = directionVector.multiply(v(getDeltaTime()))
        directionVector = directionVector.multiply(v(this.movementSpeed))

        if(directionVector.x == 0 && directionVector.y == 0) return;

        var overlappingX = currentMap.CheckObjCollision({pos:v(this.pos.x + directionVector.x, this.pos.y), scale:v(this.scale.x, this.scale.y)})
        if(overlappingX) {
            if(directionVector.x < 0) this.pos.x = ( overlappingX.pos.x + 1 ) * currentMap.tileSize + 0.01
            if(directionVector.x > 0) this.pos.x = overlappingX.pos.x * currentMap.tileSize - this.scale.x - 0.01
        } else {
            this.pos.x += directionVector.x
        }

        var overlappingY = currentMap.CheckObjCollision({pos:v(this.pos.x, this.pos.y + directionVector.y), scale:v(this.scale.x, this.scale.y)})
        if(overlappingY) {
            if(directionVector.y < 0) this.pos.y = ( overlappingY.pos.y + 1 ) * currentMap.tileSize + 0.01
            if(directionVector.y > 0) this.pos.y = overlappingY.pos.y * currentMap.tileSize - this.scale.y - 0.01
        } else {
            this.pos.y += directionVector.y
        }

        serverCommunicator.Emit("updatePos", {"id": this.id, "pos": this.pos})

        // Camera.updatePos(v((this.pos.x-(window.innerWidth-this.scale.x)/2), (this.pos.y-(window.innerHeight-this.scale.y)/2)))
    }
}

export var player = new Player("serifonium")