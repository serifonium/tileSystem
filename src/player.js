import { ctx } from "./canvas.js";
import { v } from "./vector.js";

export class Player {
    constructor() {
        this.pos = v(0, 0)
        this.scale = v(64)
        this.keybinds = {
            "up": "w",
            "down": "s"
        }
    }

    render() {
        ctx.fillStyle = '#133f9eff'
        ctx.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y)
    }

    update() {
        
    }
}

export var player = new Player()