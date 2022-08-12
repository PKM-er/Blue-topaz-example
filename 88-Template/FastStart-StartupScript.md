---
created: 2022-05-12 15:30
desc: faststart 系列的启动脚本.使用方法参考[[如何提高Obsidian的启动速度？]],目前示例库未配置。可以删除。
---

<%*
fastStart = async (filename, delayInSecond) => {
if (tp.file.exists(filename)) {
const f = tp.file.find_tfile(filename);
let plugins = (await app.vault.read(f)).split(/\r?\n/);
setTimeout(async () => {
plugins.forEach(async (p) => await app.plugins.enablePlugin(p))
}, delayInSecond * 1000)
}
}
//启动示例库最低插件运行配置启动下面，然后把后面两项的注释掉
//await fastStart("FastStart-Plugins-simple", 2)
//正常演示需要启动的插件
await fastStart("FastStart-Plugins-ShortDelay", 2)
await fastStart("FastStart-Plugins-LongDelay", 4)
%>
