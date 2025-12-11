export class Texture {
    constructor(imgsrc, collision = false) {
        this.imgsrc = imgsrc
        this.image = new Image()
        this.image.src = imgsrc
        this.collision = collision
    }
}

export const tx_stone = new Texture("./imgs/stone.png")
export const tx_dirt = new Texture("./imgs/dirt.png")
export const tx_water = new Texture("./imgs/water.png", true)