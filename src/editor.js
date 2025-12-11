import { Camera } from "./camera.js"
import { canvas, ctx } from "./canvas.js"
import { getDeltaTime, updateLastTime, updateTime } from "./deltaTime.js"
import { InputHandler } from "./inputHandling.js"
import { changeCurrentMap, Map, currentMap, Tile } from "./map.js"
import { tx_dirt, tx_stone, tx_water } from "./texture.js"
import { v } from "./vector.js"

function getUserSizePrompt() {
    var userPrompt = prompt("Map Size? (leave empty for none) (eg. '50,50')")
    var userValues = userPrompt.split(",")

    if(userValues.length != 2) return undefined
    if(+ userValues[0] == NaN) return undefined
    if(+ userValues[1] == NaN) return undefined

    return v(userValues[0], userValues[1])
}

// setup map
var mapSize = undefined
changeCurrentMap(new Map(mapSize))
currentMap.SetTile(v(0), v(100), new Tile(tx_dirt, undefined, undefined))

// setup settings
Camera.scaleFactor = 1/2
var cameraSpeed = 1

// utility functions
function getSelectedTile() {
    return currentMap.GetTile(v(InputHandler.getMousePos().snap(currentMap.tileSize).x, InputHandler.getMousePos().snap(currentMap.tileSize).y))
}

// define tool/tile/layer
const allTools = ["Pencil", "Remove"]
const allTiles = ["Dirt", "Stone", "Water"]
const allLayers = ["Background", "Midground", "Foreground"]
var selectedTool = "Pencil"
var selectedTile = "Dirt"
var selectedLayer = "Background"

// change tool/tile/layer & move camera
document.addEventListener("keydown", (e) => {
    var key = e.key.toLowerCase()

    if(key == 'q') {
        var index = allTools.indexOf(selectedTool)

        if(index >= allTools.length - 1) index = 0
        else index++
        selectedTool = allTools[index]
    } else if(key == 'e') {
        var index = allTiles.indexOf(selectedTile)

        if(index >= allTiles.length - 1) index = 0
        else index++
        selectedTile = allTiles[index]
    } else if(key == 'r') {
        var index = allLayers.indexOf(selectedLayer)

        if(index >= allLayers.length - 1) index = 0
        else index++
        selectedLayer = allLayers[index]
    }
}) 

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
    
    // render map
    currentMap.render();

    // deemphasize lower layers
    // ctx.fillStyle = "#0000007c";
    // ctx.fillRect(0, 0, 100*currentMap.tileSize, 100*currentMap.tileSize)

    // draw grid lines
    ctx.fillStyle = "#474747ff"
    for(let x = 0; x < 100; x++) {
        ctx.fillRect(x*currentMap.tileSize-1, 0, 2, 100*currentMap.tileSize)
    }
    for(let y = 0; y < 100; y++) {
        ctx.fillRect(0, y*currentMap.tileSize-1, 100*currentMap.tileSize, 2)
    }
    
    // draw selected tile
    ctx.fillStyle = "#fb434342"
    ctx.fillRect(getSelectedTile().pos.x*currentMap.tileSize+1, getSelectedTile().pos.y*currentMap.tileSize+1, 62, 62)

    // conclude transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // draw ui
    ctx.fillStyle = "#ffffffa4"
    ctx.font = "24px Arial"
    ctx.fillText("Tool: "+selectedTool, 16, 40)
    ctx.fillText("Tile: "+selectedTile, 16, 40*2)
    ctx.fillText("Layer: "+selectedLayer, 16, 40*3)
}

function update() {
    if(InputHandler.getKey('w')) {
        Camera.pos.y += -cameraSpeed*getDeltaTime()
    } else if(InputHandler.getKey('s')) {
        Camera.pos.y += cameraSpeed*getDeltaTime()
    } else if(InputHandler.getKey('a')) {
        Camera.pos.x += -cameraSpeed*getDeltaTime()
    } else if(InputHandler.getKey('d')) {
        Camera.pos.x += cameraSpeed*getDeltaTime()
    } 
    if(!InputHandler.mouse1Down) {
        return;
    }

    var texture;
    if(selectedTile == "Dirt") texture = tx_dirt
    if(selectedTile == "Stone") texture = tx_stone
    if(selectedTile == "Water") texture = tx_water

    if(!texture) return;

    var currentTile = getSelectedTile()
    var demoTile = new Tile()
    demoTile[selectedLayer.toLowerCase()] = texture

    if(selectedTool == "Pencil") {
        currentMap.SetTile(currentTile.pos, v(1), demoTile)
    }
    if(selectedTool == "Remove") {
        currentMap.RemoveTile(currentTile.pos, v(1), demoTile)
    }
}

setInterval(render, 1000/60);
setInterval(()=>{
    updateTime()
    update()
    updateLastTime()
}, 1000/60);