class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static AddVectors(v1, v2) {
        return v(v1.x+v2.x, v1.y+v2.y);
    }
    static GetDistance(v1, v2) {
        let e = v1.x - v2.x,
        r = v1.y - v2.y;
        return Math.sqrt(Math.pow(e, 2) + Math.pow(r, 2));
    }
}
function v(x, y) {
    if(y==undefined) {
        return new Vector(x, x)
    }
    return new Vector(x, y)
}

export {Vector, v}