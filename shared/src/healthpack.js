import { ctx } from "./canvas.js";
import { Entity } from "./entity.js";
import { currentMap } from "./map.js";
import { player } from "./player.js";
import { Spritesheet } from "./spritesheet.js";
import { v } from "./vector.js";

class HealthPack extends Entity {
    constructor(pos, healing = 50) {
        super(pos, v(64))
        this.healing = healing
    }
    static spritesheet = new Spritesheet("../shared/imgs/HealthPack.png")
    render() {
        ctx.drawImage(HealthPack.spritesheet.image, this.pos.x, this.pos.y)
    }
    update() {
        if(this.checkOverlapping(player) && player.health.IsFull()) {
            player.health.Heal(this.healing)
            currentMap.RemoveEntity(this.id)
        }
    }
}

export { HealthPack }