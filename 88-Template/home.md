---
banner: "https://api.xygeng.cn/Bing/"
cssclass: fullwidth,noyaml,noscroll,myhome
obsidianUIMode: preview

---
````ad-flex
```ad-icon
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-label="Calendar" role="img" viewBox="0 0 512 512" width="100%" height="100%" style="cursor: default">
      <path d="m512,455c0,32 -25,57 -57,57l-398,0c-32,0 -57,-25 -57,-57l0,-327c0,-31 25,-57 57,-57l398,0c32,0 57,26 57,57l0,327z" fill="#efefef"/>
      <path d="m484,0l-47,0l-409,0c-15,0 -28,13 -28,28l0,157l512,0l0,-157c0,-15 -13,-28 -28,-28z" fill="#cf5659"/>
      <g fill="#f3aab9">
        <circle cx="462" cy="136" r="14"/>
        <circle cx="462" cy="94" r="14"/>
        <circle cx="419" cy="136" r="14"/>
        <circle cx="419" cy="94" r="14"/>
        <circle cx="376" cy="136" r="14"/>
        <circle cx="376" cy="94" r="14"/>
      </g>
      <text id="month" x="32" y="150" fill="#fff" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="122px" style="text-anchor: left"><%+ tp.date.now("MMMM").toUpperCase() %></text>
      <text id="day" x="256" y="400" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="256px" style="text-anchor: middle"><%+ tp.date.now("DD") %></text>
      
      <text id="weekday" x="256" y="480" fill="#66757f" font-family="-apple-system, BlinkMacSystemFont, 'Noto Sans', 'Noto Sans CJK SC', 'Microsoft YaHei', 微软雅黑, sans-serif, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" font-size="64px" style="text-anchor: middle"><%+ tp.date.now("dddd") %></text>
</svg>
```

%%问候和天气数据 
传统版本 可以自动根据ip获取天气
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
%% 动画版本%%
>[!note|noborder|noborder|banner]  ![inlR|160](https://newcdn.96weixin.com/mmbiz.qlogo.cn/mmbiz_gif/xlnvrKyPG60nyRRt76t6icGhRgnxHM7UTDR2DoHNjjUOg8m0OTiaJiaTiavO0cNgbHbg3zvcjNRcODrYiaJaGZkXw0g/0?wx_fmt=gif)
>```dataviewjs
let setting = {};
//在和风天气中创建的 Api key
setting.key = "dc0f31ac6f37484f88e3e7d45b84e403";
setting.city = "郑州";//城市名
setting.days =1 ;//天气预报天数1-3
setting.icon =true ;//是否显示动态图标
setting.headerLevel = 0;//添加标题的等级
setting.addDesc = true;//是否添加描述
setting.onlyToday = false;//是否只在当天显示
setting.anotherCity = "";//添加另外一个城市
//脚本文件 weatherView.js 所在路径
dv.view("88-Template/script/weatherView",setting)
>```

````


`````ad-flex
````ad-summary
title: <svg t="1649996660534" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4372"><path d="M246.94 299.3H855V726H246.94z" fill="#FBDA31" p-id="4373"></path><path d="M815 264.87v421H209v-421h606m48-48H161v517h702v-517zM72.41 783.13h879.18v48H72.41z" fill="#333333" p-id="4374"></path></svg> 笔记统计
collapse: open
%%调用88-template\button.md%%
 
 `button-refreshhomepage1`
 `button-loadhome`
```dataviewjs
//统计笔记 nofold 里面放入需要排除的文件夹
let nofold = '!"88-Template" and !"00-Tips" and !"10-Help"'
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let total = parseInt([new Date() - ftMd.ctime] / (60*60*24*1000))
let allFile = dv.pages(nofold).file
let totalMd = "📄 =="+
	allFile.length+"== 篇不知所云的文档"
let totalTag = "=="+allFile.etags.distinct().length+"== 个乱七八糟的标签"
let totalTask = "=="+allFile.tasks.length+"== 个已荒废的事项"
dv.header(4, "您已在Ob上浪费了 =="+total+"== 天")
dv.header(5, totalMd)
dv.header(5, "🔖 "+totalTag)
dv.header(5, "🕗 " + totalTask)
```
<div>

```dataviewjs
//简单的倒计时统计算法
  let themeday= moment().diff(moment("2020-10-01"), 'days');
	dv.header(4, "🥑Blue Topaz已更新 =="+themeday+"==天");
   dv.header(5, "[如果喜欢请Star⭐](https://github.com/whyt-byte/Blue-Topaz_Obsidian-css)");

```

```dataviewjs
//个性化进度条算法
let dates = moment().format('YYYY-MM-1');
let days = moment().diff(dates, "days");
let num = (days/30 * 10).toFixed(1);
dv.header(5,"⚽光阴似箭，本月已走完"+num*10+'%<br>')
dv.span(percentageToEmotes(num))
//dv.span(percentageToEmotes(num))
function percentageToEmotes(num) {
  //小数点分割
let str = num.toString().split('.');
let anum= parseInt(str[0]);
let bnum= parseInt(str[1]);
if(!bnum)
	bnum=0;	
if(anum==10)
return "🌑".repeat(anum);
return "🌑".repeat(anum) +get_icon(bnum) + "🌕".repeat(9 - anum);

}

function get_icon(num){
switch( true ) {
    case num <=2   :
		 return "🌕"
        break;
    case num <= 4 :
		return "🌔"
        break;   
    case num <= 6 : 
		return "🌓"
        break;
	 case num <= 8 : 
		return "🌒"
        break;
		default:
		return "🌑"
        break;
		
}
}
```
</div>

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
`````

%%便签板块%%
%%可通过侧边栏主页便签按钮快捷更改便签内容%%

---
````ad-flex
<!--notice1-->
<p class="stickies" style="max-width:180px" >
<strong>倒计时</strong></br>今年已过去<strong><%+* tR+= moment().diff(tp.date.now("YYYY-1-1"), "days") %></strong>天
</br>距春节还有<strong><%+* let edate = moment("2022-02-01", "yyyy-MM-DD"); let from = moment().startOf('day'); edate.diff(from, "days") >= 0 ? tR += edate.diff(from, "days") : tR += edate.add(1, "year").diff(from, "days") %></strong>天
</p>
<!--notice2-->
<p class="stickies2" style="max-width:200px" >
美好的事情就要发生！
</p>




<!--notice3-->
<p class="stickies" style="max-width:200px">
通过侧边栏的 主页便签按钮即可快速添加 便签到主页
</p>


<!--notice4-->
<p class="stickies2" style="max-width:200px" >
💌<br> 开启美好的一天
</p>

<!---->

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

![[从这开始]]

