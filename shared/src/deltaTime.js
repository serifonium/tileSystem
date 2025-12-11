var tick = Date.now()
var lastTick = Date.now()

export function getDeltaTime() {
    return ((tick - lastTick))
}
export function updateTime() {
    tick = Date.now()
}
export function updateLastTime() {
    lastTick = Date.now()
}