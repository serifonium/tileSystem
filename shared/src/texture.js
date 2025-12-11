export class Texture {
    constructor(imgsrc, collision = false) {
        this.imgsrc = imgsrc
        this.image = new Image()
        this.image.src = imgsrc
        this.collision = collision
    }
}

export const tx_stone = new Texture("../shared/imgs/stone.png")
export const tx_dirt = new Texture("../shared/imgs/dirt.png")
export const tx_water = new Texture("../shared/imgs/water.png", true)