var canvas = undefined;
var ctx = undefined;

if(typeof document !== 'undefined') {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    ctx.setStyle = (fillStyle = "#fff", strokeStyle = "#fff", lineWidth = 4, globalAlpha = 1) => {
        ctx.fillStyle = fillStyle
        ctx.strokeStyle = strokeStyle
        ctx.lineWidth = lineWidth
        ctx.globalAlpha = globalAlpha
    }
}

export {canvas, ctx}