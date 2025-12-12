class Spritesheet {
    constructor(imgsrc) {
        this.imgsrc = imgsrc
        if(typeof Image !== "undefined") {
            this.image = new Image()
            this.image.src = imgsrc
        }
    }
}

export { Spritesheet }