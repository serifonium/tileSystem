import { getDeltaTime } from "./deltaTime.js";
import {v} from "./vector.js"

class Camera {
    static pos = v(0, 0);
    static scale = v(1000)
    static bounds = undefined
    static scaleFactor = 1;
    static vel = v(0)

    static updatePos(pos) {
        Camera.pos = pos;
        Camera.pos.x = Math.max(0, Camera.pos.x);
        if(Camera.bounds) Camera.pos.x = Math.min(Camera.bounds.x-Camera.scale.x, Camera.pos.x);
        Camera.pos.y = Math.max(0, Camera.pos.y);
        if(Camera.bounds) Camera.pos.y = Math.min(Camera.bounds.y-Camera.scale.y, Camera.pos.y);
    }
    static updateSize(scale) {
        Camera.scale = scale
    }
    static updateVel() {
        Camera.pos.x += Camera.vel.x * getDeltaTime()
        Camera.pos.y += Camera.vel.y * getDeltaTime()
    }
}

export {Camera};