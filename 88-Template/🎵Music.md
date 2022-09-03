---
obsidianUIMode: preview
desc: 播放音乐组件，可以嵌入到其他文档，或者通过命令play music 调用
---

````ad-music
title: 随机音乐
collapse: close
```dataviewjs
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{
let music=history[today].music;
dv.el("blockquote", music);
}
```
````
```ad-music
title: 自选歌单
collapse: close
 <iframe frameborder="0" border="1" marginwidth="0" marginheight="0" width=100% height=86 src="https://music.163.com/outchain/player?type=2&id=488249475&auto=0&height=66"> </iframe>

 <iframe frameborder="0" border="1" marginwidth="0" marginheight="0" width=100% height=86 src="https://music.163.com/outchain/player?type=2&id=492857516&auto=0&height=66"> </iframe>
```

%%自行更换代码中的id 可以换成自己的歌单id，下面是推荐的%%
%%安静看书的背景音乐 8418150 %%
%%好听的热门歌单  6894168416 %%
%% 高效率专注记忆音乐  6683129 %%
%%lavi共享的歌单 7354648923%%


````ad-col2
title: 精选歌单
```jsx::Musicbar
6894168416
```
```jsx::Musicbar
8418150
```
```jsx::Musicbar
7354648923
```
```jsx::Musicbar
6683129
```
```jsx::Musicbar
360062344
```
```jsx::Musicbar
5454637196
```
```jsx::Musicbar
2961061456
````
### 更多歌单列表
[全部歌单 - 歌单 - 网易云音乐 (163.com)](https://music.163.com/#/discover/playlist)


