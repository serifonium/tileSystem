export class Texture {
    constructor(imgsrc) {
        this.imgsrc = imgsrc
        this.image = new Image()
        this.image.src = imgsrc
    }
}

export const tx_stone = new Texture("./imgs/stone.png")
export const tx_dirt = new Texture("./imgs/dirt.png")