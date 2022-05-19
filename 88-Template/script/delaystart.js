module.exports = delaystart
let quickAddApi;

async function delaystart () {
     let start = new Date().getTime()
    // 阻塞3s
	console.log("延迟启动中...");
    while (new Date().getTime() - start < 10000) {
      continue
    }
}