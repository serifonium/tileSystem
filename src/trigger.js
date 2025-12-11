import { Entity } from "./entity.js";

export class Trigger extends Entity {
    constructor(pos=v(0), scale=v(64), onCollision=(()=>{})) {
        this.pos = pos;
        this.scale = scale;
        this.onCollision = onCollision;
    }
}