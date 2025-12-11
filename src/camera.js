import { getDeltaTime } from "./deltaTime.js";
import {v} from "./vector.js"

class Camera {
    static pos = v(0, 0);
    static scale = v(window.innerWidth, window.innerHeight)
    static scaleFactor = 1;
    static vel = v(0)

    static updatePos(pos) {
        Camera.pos = pos
    }
    static updateVel() {
        Camera.pos.x += Camera.vel.x * getDeltaTime()
        Camera.pos.y += Camera.vel.y * getDeltaTime()
    }
}

export {Camera};