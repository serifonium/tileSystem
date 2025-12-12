import { v } from "./vector.js";

export class Entity {
    constructor(pos=v(0), scale=v(64)) {
        this.id;
        this.pos = pos;
        this.scale = scale;
    }
    checkOverlapping(obj) {
        if (obj.pos.x > this.scale.x + this.pos.x || this.pos.x > obj.scale.x + obj.pos.x || obj.pos.y > this.scale.y + this.pos.y || this.pos.y > obj.scale.y + obj.pos.y) {
            return false;
        }
        return true;
    }
    getMiddle() {
        return v(this.pos.x+this.scale.x/2, this.pos.y+this.scale.y/2)
    }
}