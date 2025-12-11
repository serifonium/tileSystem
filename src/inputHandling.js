import { Camera } from "./camera.js";
import { v } from "./vector.js"

class InputHandler {
    static rawMousePos = v(0, 0);
    static gameMousePos = v(0, 0);

    static mouse1Down = false;
    static mouse2Down = false;
    static mouse3Down = false;
    
    static updateMousePos(pos) {
        this.rawMousePos = pos
        this.gameMousePos = v((this.rawMousePos.x/Camera.scaleFactor-Camera.pos.x), (this.rawMousePos.y/Camera.scaleFactor-Camera.pos.y))
    }
    static getMousePos() {
        return v((this.rawMousePos.x/Camera.scaleFactor+Camera.pos.x), (this.rawMousePos.y/Camera.scaleFactor+Camera.pos.y))
    }
    static mouseDown(type) {
        if (type == 2) { this.mouse2Down = true; } 
        else if (type == 3) { this.mouse3Down = true; } 
        else { this.mouse1Down = true; }
    }
    static mouseUp(type) {
        if (type == 2) { this.mouse2Down = false; } 
        else if (type == 3) { this.mouse3Down = false; } 
        else { this.mouse1Down = false; }
    }

    static rawKeys = {};
    static keys = {};

    static keyDown(key) {
        this.rawKeys[key] = true;
        this.keys[key.toLowerCase()] = true;
        this.onKeyDown(key)
    }
    static keyUp(key) {
        this.rawKeys[key] = false;
        this.keys[key.toLowerCase()] = false;
    }
    static getKey(key) {
        //console.log(this.keys, key)
        return this.keys[key];
    }
    static getRawKey(key) {
        return this.keys[key];
    }

    static onKeyDown() {

    }
}

document.addEventListener("keydown", (e) => {
    InputHandler.keyDown(e.key)
})

document.addEventListener("keyup", (e) => {
    InputHandler.keyUp(e.key)
})

document.addEventListener("mousemove", (e) => {
    InputHandler.updateMousePos(v(e.pageX, e.pageY))
})

document.addEventListener("mousedown", (e) => {
    InputHandler.mouseDown()
})

document.addEventListener("mouseup", (e) => {
    InputHandler.mouseUp()
})

export {InputHandler};