---
cssclass: fullwidth,noyaml,noscroll,myhome
banner: https://api.xygeng.cn/Bing/
obsidianUIMode: preview
banner_icon: 💘
---

%%问候和天气数据%%
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
 


````ad-flex
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
🌸<br> 每天一个好心情！！
</p>

<!--notice3-->
<p class="stickies" style="max-width:200px">
💖<br> 永远相信美好的事情就要发生！
</p>

<!--notice4-->
<p class="stickies2" style="max-width:200px" >
💌<br> 开启美好的一天
</p>

<!---->

````
---

###  每日一句
````ad-flex
%%调用每日一句%%
%%数据位于.obsidian/.diary-stats%%
```dataviewjs
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{
let quotes=history[today].quotes;
dv.el("blockquote", quotes);
}

```
%%调用网易热门歌曲榜%%
%%数据位于.obsidian/.diary-stats%%
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

![[从这开始]]

