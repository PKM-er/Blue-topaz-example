---
obsidianUIMode: preview
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
 <iframe frameborder="0" border="1" marginwidth="0" marginheight="0" width=280 height=86 src="https://music.163.com/outchain/player?type=2&id=488249475&auto=0&height=66"> </iframe>

 <iframe frameborder="0" border="1" marginwidth="0" marginheight="0" width=280 height=86 src="https://music.163.com/outchain/player?type=2&id=492857516&auto=0&height=66"> </iframe>
```

````ad-flex
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


