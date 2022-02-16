module.exports = imgpath
let images = []

async function imgpath (folders) {
    await init(folders);
    return images[Math.floor(Math.random() * images.length)].path
}

async function init(folders){
	images = images.concat(await app.fileManager.vault.fileMap[folders].children)
}
