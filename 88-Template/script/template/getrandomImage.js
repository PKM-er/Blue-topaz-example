module.exports = imgpath
let images = []
let folders = ["99-Attachment/banner"]

/* async function short (params) {
    await init(params);
    return images[Math.floor(Math.random() * images.length)].name
} */

async function imgpath (params) {
    await init(params);
    return images[Math.floor(Math.random() * images.length)].path
}

async function init(params){
    for(let i = 0; i < folders.length; i++)  images = images.concat(await app.fileManager.vault.fileMap[folders[i]].children)
}
