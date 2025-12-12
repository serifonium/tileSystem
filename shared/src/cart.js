import { ctx } from "./canvas.js";
import { Entity } from "./entity.js";
import { v } from "./vector.js";

export class Cart extends Entity {
    constructor(pos=v(0)) {
        super(pos, v(64))
        this.range = 200
    }

    render() {
        ctx.fillStyle = "#556b9eff"
        ctx.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y)

        ctx.fillStyle = "#556b9e46"
        ctx.strokeStyle = "#668eedff"
        ctx.lineWidth = 4;
        ctx.arc(this.getMiddle().x, this.getMiddle().y, this.range, 0, Math.PI*2)
        ctx.fill()
        ctx.arc(this.getMiddle().x, this.getMiddle().y, this.range, 0, Math.PI*2)
        ctx.stroke()
    }
}

export class CartNode extends Entity {

}