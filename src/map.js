import { ctx } from "./canvas.js"
import { generateID } from "./idGen.js"
import { Texture } from "./texture.js"
import { v, Vector } from "./vector.js"

class Map {
    constructor(size) {
        this.tiles = []
        this.entities = []
        this.tileSize = 64
        this.size = size
    }

    /**
     * Sets an area to a specified tile.
     * If tiles overlap the newest x-grounds are carried over
     * @param {Vector} pos The position to set.
     * @param {Vector} scale The area to set from the position.
     * @param {Tile} tile_ The tile settings to add.
     */
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
    /**
     * Removes x-grounds if x-ground isnt set.
     * @param {Vector} pos The position to remove.
     * @param {Vector} scale The area to remove from the position.
     * @param {Tile} tile The tile settings to add.
     */
    RemoveTile(pos, scale, tile) {
        if(!tile) tile = new Tile()
        if(!scale) scale = v(1, 1)

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
    /**
     * Get the tile at a position.
     * @param {Vector} pos The position to check.
     * @return {Tile} The tile at the position.
     */
    GetTile(pos) {
        if(this.tiles[pos.x] == undefined) return undefined;
        if(this.tiles[pos.x][pos.y] == undefined) return undefined;

        return this.tiles[pos.x][pos.y]
    }
    /**
     * Adds an entity and returns its unique ID.
     * @param {Object} obj The entity to add.
     * @return {String} The unique ID of the entity.
     */
    AddEntity(obj) {
        obj.id = generateID()
        this.entities.push(obj)
        return obj.id
    }
    /**
     * Removes an entity by its ID.
     * @param {String} id The ID to remove.
     * @return {Boolean} If the entity was removed.
     */
    RemoveEntity(id) {
        for(let o in this.entities) {
            if(this.entities[o].id == id) {
                this.entities.splice(o, 1)
                return true;
            }
        }
        return false
    }
    /**
     * Fetches an entity by its ID.
     * @param {String} id The ID to query.
     * @return {Object} The entity with the ID.
     */
    GetEntityByID(id) {
        for(let obj of this.entities) {
            if(obj.id == id) {
                return obj;
            }
        }
    }
    /**
     * Fetches all tiles.
     * @return {Tile[]} The list of all tiles.
     */
    GetAllTiles() {
        var tileList = []
        for(let x = 0; x < this.tiles.length; x++) { // loop through x
            if(this.tiles[x] == undefined) continue;
            for(let y = 0; y < this.tiles[x].length; y++) { // loop through y
                if(this.tiles[x][y] == undefined) continue;
                tileList.push(this.tiles[x][y])
            }
        }
        return tileList
    }
    /**
     * Fetches all entites.
     * @return {Object[]} The list of all entites.
     */
    GetAllEntities() {
        var entityList = []
        for(let obj of this.entities) {
            entityList.push(obj)
        }
        return entityList
    }

    render() {
        for(let tile of this.GetAllTiles()) {
            if(tile.render) tile.render()
        }
        for(let obj of this.GetAllEntities()) {
            if(obj.render) obj.render()
        }
    }

    update() {
        for(let tile of this.GetAllTiles()) {
            if(tile.update) tile.update()
        }
        for(let obj of this.GetAllEntities()) {
            if(obj.update) obj.update()
        }
    }

    stringify() {
        return JSON.stringify(this)
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

var currentMap = new Map();

function changeCurrentMap(map) {
    currentMap = map
}

function parseMap(mapString) {
    var JSONmap = JSON.parse(mapString)
    var map = new Map(JSONmap.size)

    for (const [key, value] of Object.entries(JSONmap)) {
        map[key] = value
    }

    map.tiles = [];

    for(let x = 0; x < JSONmap.tiles.length; x++) { // loop through x
        if(JSONmap.tiles[x] == undefined) continue;
        for(let y = 0; y < JSONmap.tiles[x].length; y++) { // loop through y
            if(JSONmap.tiles[x][y] == undefined) continue;

            var tile = new Tile()

            for (const [key, value] of Object.entries(JSONmap.tiles[x][y])) {
                tile[key] = value
            }

            if(JSONmap.tiles[x][y].background) tile.background = new Texture(JSONmap.tiles[x][y].background.imgsrc);
            if(JSONmap.tiles[x][y].midground) tile.midground = new Texture(JSONmap.tiles[x][y].midground.imgsrc);
            if(JSONmap.tiles[x][y].foreground) tile.foreground = new Texture(JSONmap.tiles[x][y].foreground.imgsrc);

            map.SetTile(v(x, y), v(1, 1), tile)
        }
    }
    return map
}

export { Map, Tile, changeCurrentMap, parseMap, currentMap }