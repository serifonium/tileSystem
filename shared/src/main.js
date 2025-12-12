import { Camera } from "./camera.js";
import { canvas, ctx } from "./canvas.js";
import { updateLastTime, updateTime } from "./deltaTime.js";
import { HealthPack } from "./healthpack.js";
import { InputHandler } from "./inputHandling.js";
import { changeCurrentMap, currentMap, Map, parseMap, Tile } from "./map.js";
import { multiplayerHandler } from "./multiplayer.js";
import { player } from "./player.js";
import { tx_dirt, tx_stone, tx_water } from "./texture.js";
import { v } from "./vector.js";

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

changeCurrentMap(new Map(v(50)))
currentMap.SetTile(v(0, 0), v(50, 50), new Tile(tx_dirt, undefined, undefined));
currentMap.SetTile(v(3, 5), v(3, 2), new Tile(undefined, tx_stone, undefined));
currentMap.SetTile(v(4, 5), v(3, 3), new Tile(tx_water, undefined, undefined));
currentMap.RemoveTile(v(4, 5), v(2, 1), new Tile(undefined, 0, undefined))

multiplayerHandler.AskForUser()

// RENDER
function render() {
    // resize canvas to window size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    Camera.updateSize(v(window.innerWidth, window.innerHeight))

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
    currentMap.render("entities");
    multiplayerHandler.renderPlayers();
    player.render();
    currentMap.render("foreground");

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// UPDATE
var updateTick = 0
function update() {
    updateTick++;
    updateTime()

    currentMap.update();

    player.update();

    if(updateTick%4) multiplayerHandler.UpdatePosition()

    updateLastTime();
}


// setInterval setTimeout
setInterval(render, 1000/60);
setInterval(update, 1000/60);

console.log("---HealthComponent Test:---")
console.log("Current Health: " + player.health.GetHealth())
player.health.Damage(149)
console.log("Current Health: " + player.health.GetHealth())
player.health.Heal(25)
console.log("Current Health: " + player.health.GetHealth())
console.log("---HealthComponent Test End---")

// setTimeout(()=>{
//     let tempID = currentMap.AddEntity(new HealthPack(v(64*Math.floor(Math.random()*7)+3, 64*2)));
//     console.log(currentMap.GetEntityByID(tempID))

//     multiplayerHandler.AddEntity(currentMap.GetEntityByID(tempID))
// }, 300)
