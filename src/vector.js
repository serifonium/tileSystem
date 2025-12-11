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
    add(vector) {
        return v(this.x + vector.x, this.y + vector.y)
    }
    multiply(vector) {
        return v(this.x * vector.x, this.y * vector.y)
    }
    snap(factor) {
        return v(Math.floor(this.x/factor), Math.floor(this.y/factor))
    }
}
function v(x, y) {
    if(y==undefined) {
        return new Vector(x, x)
    }
    return new Vector(x, y)
}

function overlap(a, b) {
  // Check x and y for overlap
  if (b.pos.x > a.scale.x + a.pos.x || a.pos.x > b.scale.x + b.pos.x || b.pos.y > a.scale.y + a.pos.y || a.pos.y > b.scale.y + b.pos.y) {
      return false;
  }
  return true;
}

export {Vector, v, overlap}