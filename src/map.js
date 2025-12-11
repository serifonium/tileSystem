import { ctx } from "./canvas.js"
import { v } from "./vector.js"

class Map {
    constructor(size) {
        this.tiles = []
        this.tileSize = 64
        this.size = size
    }

    // Sets an area to a specified tile
    // If tiles overlap the newext x-grounds are carried over
    SetTile(pos, scale, tile_) {
        if(scale == undefined) scale = v(1, 1)
        for(let x = pos.x; x < pos.x+scale.x; x++) {
            if(this.tiles[x] == undefined) this.tiles[x] = []
            for(let y = pos.y; y < pos.y+scale.y; y++) {

                let tile = new Tile(tile_.background, tile_.midground, tile_.foreground);

                if(this.tiles[x][y] != undefined) { // if already a tile

                    if(tile.background != undefined) this.tiles[x][y].background = tile.background
                    if(tile.midground != undefined) this.tiles[x][y].midground = tile.midground
                    if(tile.foreground != undefined) this.tiles[x][y].foreground = tile.foreground

                } else { // if no tile exists
                    tile.pos = v(x, y);
                    tile.tileSize = this.tileSize;
                    this.tiles[x][y] = tile;
                }
            }
        }
    }
    RemoveTile(pos, scale, tile) {
        if(tile == undefined) tile = new Tile()
        if(scale == undefined) scale = v(1, 1)
        for(let x = pos.x; x < pos.x+scale.x; x++) {
            if(this.tiles[x] == undefined) continue;
            for(let y = pos.y; y < pos.y+scale.y; y++) {

                if(this.tiles[x][y] == undefined) continue;

                if(!(tile.background || tile.midground || tile.foreground)) {
                    this.tiles[x][y] = undefined;
                    continue;
                }

                // removes x-ground if x-ground is not set
                if(tile.background == undefined) this.tiles[x][y].background = undefined
                if(tile.midground == undefined) this.tiles[x][y].midground = undefined
                if(tile.foreground == undefined) this.tiles[x][y].foreground = undefined

            }
        }
    }

    GetAllTiles() {
        var tileList = []
        for(let x = 0; x < this.tiles.length; x++) {
            if(this.tiles[x] == undefined) continue;
            for(let y = 0; y < this.tiles[x].length; y++) {
                if(this.tiles[x][y] == undefined) continue;
                tileList.push(this.tiles[x][y])
            }
        }
        return tileList
    }

    render() {
        for(let tile of this.GetAllTiles()) {
            tile.render()
        }
    }
}

class Tile {
    constructor(background, midground, foreground) {
        this.background = background // movement + utility
        this.midground = midground // collision
        this.foreground = foreground // collision + utility
    }
    render() {
        if(this.background) ctx.drawImage(this.background.image, this.pos.x*this.tileSize, this.pos.y*this.tileSize, this.tileSize, this.tileSize)
        if(this.midground) ctx.drawImage(this.midground.image, this.pos.x*this.tileSize, this.pos.y*this.tileSize, this.tileSize, this.tileSize)
        if(this.foreground) ctx.drawImage(this.foreground.image, this.pos.x*this.tileSize, this.pos.y*this.tileSize, this.tileSize, this.tileSize)
    }
}

function changeCurrentMap(map) {

}

export { Map, Tile, changeCurrentMap }