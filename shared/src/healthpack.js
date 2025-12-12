import { serverCommunicator } from "../../server/serverCommunicator.js";
import { ctx } from "./canvas.js";
import { getDeltaTime } from "./deltaTime.js";
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
    update(map) {
        for(let player_ of serverCommunicator.GetAllPlayers()) {
            if(this.checkOverlapping(player_)) {
                player_.health.Heal(this.healing)
                currentMap.RemoveEntity(this.id)
            }
        }
    }
}

class HealthPackSpawner extends Entity {
    constructor(pos, healing = 50, period = 10) {
        super(pos, v(64))
        this.healing = healing
        this.period = period*1000
        this.time = 0;
        this.currentHealthPackID = undefined
    }
    update() {
        if(currentMap.GetEntityByID(this.currentHealthPackID)) {
            return;
        }
        
        this.time += getDeltaTime();
        if(this.time > this.period) {
            

            console.log(getDeltaTime())
            this.time -= this.period
            let healthPack = new HealthPack(v(this.pos.x, this.pos.y), this.healing)
            this.currentHealthPackID = currentMap.AddEntity(healthPack)
        }
    }
    render() {
        ctx.fillStyle = "#a932329b"
        ctx.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y)
    }
}

export { HealthPack, HealthPackSpawner }