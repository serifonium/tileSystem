import { Camera } from "./camera.js";
import { canvas, ctx } from "./canvas.js";
import { updateLastTime, updateTime } from "./deltaTime.js";
import { InputHandler } from "./inputHandling.js";
import { changeCurrentMap, currentMap, Map, parseMap, Tile } from "./map.js";
import { player } from "./player.js";
import { tx_dirt, tx_stone, tx_water } from "./texture.js";
import { v } from "./vector.js";

changeCurrentMap(new Map(v(50)))

currentMap.SetTile(v(0, 0), v(50, 50), new Tile(tx_dirt, undefined, undefined));

currentMap.SetTile(v(3, 5), v(3, 2), new Tile(undefined, tx_stone, undefined));
currentMap.SetTile(v(4, 5), v(3, 3), new Tile(tx_water, undefined, undefined));
currentMap.RemoveTile(v(4, 5), v(2, 1), new Tile(undefined, 0, undefined))

let tempID = currentMap.AddEntity({"pos":v(0, 0)})

console.log(currentMap);

function render() {
    // resize canvas to window size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    Camera.updateSize()

    // move camera and mouse
    // InputHandler.gameMousePos.x += Camera.pos.x - (-player.getMiddle().x + window.innerWidth/(2*Camera.scaleFactor));
    // InputHandler.gameMousePos.y += Camera.pos.y - (-player.getMiddle().y + window.innerHeight/(2*Camera.scaleFactor));
    // Camera.updatePos(v(-player.getMiddle().x + window.innerWidth/(2*Camera.scaleFactor), -player.getMiddle().y + window.innerHeight/(2*Camera.scaleFactor)))

    // fill background
    ctx.fillStyle = "#222"
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    // apply transformations
    ctx.scale(Camera.scaleFactor, Camera.scaleFactor);
    ctx.translate(-Camera.pos.x, -Camera.pos.y);
    
    // render map & player
    currentMap.render("background");
    currentMap.render("midground");
    player.render();
    currentMap.render("entities");
    currentMap.render("foreground");

    // render player
    

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function update() {
    updateTime()

    currentMap.update();

    player.update();

    updateLastTime();
}

// setInterval setTimeout
setInterval(render, 1000/60);
setInterval(update, 1000/60);