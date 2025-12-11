export function generateID(length) {
    if(!length) length = Math.floor(Math.random()*10+20)
    const characterPool = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTTUVWXYZ!@#$%^&*?"

    var id = ""

    for(let i = 0; i < length; i++) {
        id += characterPool.charAt(Math.floor(Math.random()*characterPool.length))
    }

    return id
}