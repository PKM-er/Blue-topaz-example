---
banner: "https://api.dujin.org/bing/1920.php"
cssclass: fullwidth,noyaml,noscroll,myhome
obsidianUIMode: preview
---

```ad-icon
<svg xmlns="http://www.w3.org/2000/svg" aria-label="Calendar" role="img" viewBox="0 0 512 512">
  <path d="M512 455c0 32-25 57-57 57H57c-32 0-57-25-57-57V128c0-31 25-57 57-57h398c32 0 57 26 57 57z" fill="#e0e7ec"></path>
  <path d="M484 0h-47c2 4 4 9 4 14a28 28 0 1 1-53-14H124c3 4 4 9 4 14A28 28 0 1 1 75 0H28C13 0 0 13 0 28v157h512V28c0-15-13-28-28-28z" fill="#cf5659"></path>
 <g fill="#f3aab9">
        <circle cx="462" cy="136" r="14"/>
        <circle cx="462" cy="94" r="14"/>
        <circle cx="419" cy="136" r="14"/>
        <circle cx="419" cy="94" r="14"/>
        <circle cx="376" cy="136" r="14"/>
        <circle cx="376" cy="94" r="14"/>
      </g>
  <text id="month" x="32" y="164" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="122px" style="text-anchor: left"><%+ tp.date.now("MMMM").toUpperCase() %>
  </text>
  <text id="day" x="256" y="400" fill="#333" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="256px" style="text-anchor: middle"><%+ tp.date.now("D") %>
  </text>
  <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle"><%+ tp.date.now("dddd") %>
  </text>
</svg>
```

%%问候和天气数据 
传统版本 目前已弃用
```ad-flex

<div style="float:left"><%+ tp.date.now("A好，今天是YYYY年MM月Do dddd") %>
</div> 
<div>
<iframe style="float:right; margin-top:3px" width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="https://i.tianqi.com?c=code&id=34&bdc=%23&icon=4&site=14"></iframe>
<!------- 黑暗模式使用下面代码
<iframe style="float:right; margin-top:3px" width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="https://i.tianqi.com?color=%23%FFFFFE&c=code&id=34&bdc=%23&icon=4&site=14"></iframe>
------->
<!-----指定城市后面添加城市拼音比例如 重庆天气预报：https://i.tianqi.com/?c=code&id=34&bdc=%23&icon=4&site=14&py=chongqing------>
</div>
```
%%
%% 动画猫 %%
```jsx::AnimationCat
```
%% --文字版天气加图标--开始 %%
>[!note|noborder banner]  &nbsp;
>```dataviewjs
let setting = {};
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{let weather=history[today].weather;
let todayweather = weather[0];
setting.iconDay =  weather[0].iconDay;
setting.windSpeedDay =  weather[0].windSpeedDay;
setting.windSpeedNight =  weather[0].windSpeedNight;
await dv.view("88-Template/script/dv_weatherSvg",setting)
let desc = ` <%+ tp.date.now("A好，今天是YYYY年MM月Do dddd") %> ，${todayweather.city} ${todayweather.textDay}， ${todayweather.tempMin}~${todayweather.tempMax}℃  ${todayweather.air} ${todayweather.windydesc} [[最近天气查询|✈️]] \n云朵充盈了${todayweather.cloud}%的天空\n顺便，如果有机会看见月亮的话，那么它应该是这样的${todayweather.moonPhase.replace(/[\u4e00-\u9fa5]/g,"")}`;
dv.paragraph(desc);
}
>```
%% ---文字版天气加图标--结束 %%


```ad-blank
- [[00-Tips|使用技巧]]
- [[微信读书清单|微信读书]]
- [[▪示例库移植说明|移植说明]]
- [[◾ Dataview相关实例]]
- [[电影看板|影视看板]]
```

````ad-grid
> [!profile-card|cards]  `button-refreshhomepage1`
> ***快乐摸鱼又一天***
> **瞅瞅你的笔记写了多少篇**
>>[!profile-card-inf|noborder]
>>```dataviewjs
>>let nofold = '!"88-Template"'
>>let ftMd = dv.pages("").file.sort(t => t.cday)[0]
>>let total = parseInt([new Date() - ftMd.ctime] / (60*60*24*1000))
>>let allFile = dv.pages(nofold).file
>>dv.paragraph(`
>>>[!item|noborder] [[echarts-笔记动态显示-分布|${total}]]
>>> Ob天数
>>
>>>[!item|noborder] [${allFile.length}](obsidian://advanced-uri?commandid=obsidian-better-command-palette%253Aopen-better-commmand-palette-file-search)
>>> 文档
>>
>>>[!item|noborder] [[文件夹所有标签|${allFile.etags.distinct().length}]]
>>> 标签
>>
>>>[!item|noborder] [[任务卡片-dataview 任务查询举例#所有未完成的任务|${allFile.tasks.length}]]
>>> 事项`)
>>```

> [!profile-card] ![[obsidian_image.png]]
> 
>>[!profile-card-inf|noborder]
>>```dataviewjs
>>let nofold = '!"88-Template" and !"99-Attachment" and !"50-Inbox" and !#moc'
>>let fold = '!"88-Template" and !"99-Attachment" and !"50-Inbox" and !#moc'
>>let files = dv.pages(nofold).file
>>const random = Math.floor(Math.random() * (files.length - 1))
>>const randomNote = files[random]
>>dv.paragraph(dv.page(randomNote.path).file.link)
>>dv.paragraph(dv.fileLink(randomNote.name,true))
>>```
%%调用词霸的每日海报%%
%%数据位于.obsidian/.diary-stats%%
```dataviewjs
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{
let posters=history[today].posters;
dv.paragraph(posters);
}
```
````

%%便签板块%%
%%可通过侧边栏主页便签按钮快捷更改便签内容%%
---

````ad-flex
%%notice1%%
> [!stickies3]
> ## 倒计时
>> 今年已过去 <%+* tR+= moment().diff(tp.date.now("YYYY-1-1"), "days") %> 天
>> 
>> 距春节还有<%+* let edate = moment("2022-02-01", "yyyy-MM-DD"); let from = moment().startOf('day'); edate.diff(from, "days") >= 0 ? tR += edate.diff(from, "days") : tR += edate.add(1, "year").diff(from, "days") %> 天

%%notice2%%
> [!stickies3|blue]
>```dataviewjs
let reg=/[\u4e00-\u9fa5]/
let nofold = '!"88-Template" and !"99-Attachment" and !"50-Inbox" and !"20-Diary"'
let files = dv.pages(nofold).file
const random = Math.floor(Math.random() * (files.length - 1))
const randomNote = files[random]
dv.paragraph(randomNote.link)
const sampleTFile = this.app.vault.getAbstractFileByPath(randomNote.path);
const contents = await this.app.vault.cachedRead(sampleTFile); 
let lines = contents.split("---\n").filter(line => line.match(reg))
const randomline = Math.floor(Math.random() * (lines.length - 1))
lines = lines[randomline].replace(/(\r|\n|#|-|\*|\t|\>)/gi,"").substr(0,80) + '...';
dv.span(lines)
>```

%%notice3%%
> [!stickies3|pink]
> ```dataviewjs
let nofold = '!"88-Template" and !"99-Attachment" and !"50-Inbox" and #book or #Movie'
let reg =/!\[[^\]]*\]\((?<=\!\[.*\]\()(.*(jpg|jpeg|bmp|gif|png|JPG|JPEG|BMP|GIF|PNG|WebP).*)(?=\))\)/ //匹配网络链接图片
let files = dv.pages(nofold).file
const arr = files.map(async (file) => {
const sampleTFile = this.app.vault.getAbstractFileByPath(file.path);
const content = await this.app.vault.cachedRead(sampleTFile); 
const links = content.match(reg);
if (links) 
{let res ={'file':file.path,'link':links[1]}
return res}
})
Promise.all(arr).then(
values => 
{
let flatvalues =values.filter(Boolean).flat()
const random = Math.floor(Math.random() * (flatvalues.length - 1))
dv.paragraph(`[![image|220](${flatvalues[random].link})](obsidian://open?file=${encodeURIComponent(flatvalues[random].file)})`)
}
)
>```

%%notice4%%
> [!stickies3|green]
> ### 💌
> 开启美好的一天

````

---


`````ad-flex
%%调用每日一句%%
%%数据位于.obsidian/.diary-stats%%

> [!tip] 每日一句
> ```dataviewjs
 let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
 let today = moment().format("YYYY-MM-DD");
 if (history.hasOwnProperty(today))
 {
 let quotes=history[today].quotes;
 dv.el("blockquote", quotes);
 }
> ```


%%调用网易热门歌曲榜%%
%%数据位于.obsidian/.diary-stats%%
````ad-note
title: 🎵 每日音乐
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

`````


![[从这开始#MOC]]

![[从这开始#最近编辑]]

![[通过下拉框检索文件示例]]

![[项目追踪（完成的字数和任务）#选择需要跟踪的项目]]

---
