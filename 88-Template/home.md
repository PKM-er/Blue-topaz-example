---
cssclass: fullwidth,noyaml,noscroll,myhome
banner: https://api.xygeng.cn/Bing/
obsidianUIMode: preview
banner_icon: 💘
---



 <div style=" margin: 5px;"> <div style="float:left"><%+ tp.date.now("A好，今天是YYYY年MM月Do dddd") %></div> <iframe style="float:right; margin-top:3px" width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="https://i.tianqi.com?c=code&id=34&bdc=%23&icon=4&site=14"></iframe>
</div>
</div> 
<br>



 
```dataviewjs

//查看文件是否存在
 app.vault.adapter.exists(".diary-stats").then(async (exists) => {
            if (!exists) {
                app.vault.adapter.write(".diary-stats", "{}");
            }

});
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".diary-stats")));
//查看当天信息
let today = moment().format("YYYY-MM-DD");
await updateToday();


//获取每日一言信息
async function getinfo() 
{
      console.log("beigin fetch hitokoto...");
let url='https://v1.hitokoto.cn/?encode=json&c=d&c=i';
   let finalURL = new URL(url);
let response = await request({method: 'GET', url: finalURL.toString()});![[]]
let data = JSON.parse(response);
	
	let who =data['from_who'];
		 if(!who) who =' ';
  const new_content = `${data['hitokoto']} <br> <em style="display: inline-block;text-indent: 4em;"> &mdash; 来自 ${who}  《${data['from']}》</em>`; 
  return new_content;
}

//在Ob中获取网易音乐热歌榜
//首发于Blue topaz Examples 
//转发请注明出处谢谢！
function getUrlQueryParams(url){
	const params = {};
	const keys = url.match(/([^?&]+)(?==)/g);
	const values = url.match(/(?<==)([^&]*)/g);
	for(const index in keys){
		params[keys[index]] =  values[index];
	}
	return params;
}



async function getmusicinfo() 
{
     console.log("beigin fetch getmusicinfo...");
let music_id='1819970423';
let iframe='';
let url='https://api.uomg.com/api/rand.music?sort=%E7%83%AD%E6%AD%8C%E6%A6%9C&format=json';
   let finalURL = new URL(url);
   let result='';
	result=await  fetch(finalURL, {
		method: 'GET'
	}).then(async (res) => await res.json());
	let data =result['data'];
	let code =result['code'];
	if(code==1)
	{
	   let music_url=getUrlQueryParams(data.url);
		music_id= music_url.id;
		console.log(music_id);
		iframe='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="https://music.163.com/outchain/player?type=2&id='+music_id+'&auto=0&height=66"></iframe>' ;
		return iframe;
	}
}

async function get_BlueTopaz() {
    console.log("beigin fetch get_BlueTopaz...");
    let themeday= moment().diff(moment("2020-10-01"), 'days');
    let result =  "\n#### 🥑Blue Topaz已更新 =="+themeday+"==天";
    result = result + "\n##### [如果喜欢请Star⭐](https://github.com/whyt-byte/Blue-Topaz_Obsidian-css)";
    return result;
}

//写入信息

async function updateToday() {

        if (!history.hasOwnProperty(moment().format("YYYY-MM-DD"))) {
		const newDay = {
            quotes: await getinfo(),
            posters: await get_ciba(),
            music: await getmusicinfo(),
            themes: await get_BlueTopaz(),
            state: 0,       
        };
            history[moment().format("YYYY-MM-DD")] = newDay;
			 await update();
        }
        today = moment().format("YYYY-MM-DD");
       
    }
async function update() 
{
 app.vault.adapter.write(".diary-stats", JSON.stringify(history));
}

//在Ob中获取每日词霸
//首发于Blue topaz Examples 
//转发请注明出处谢谢

async function get_ciba() {
    console.log("beigin fetch get_ciba...");
let pic='';
let tts='';
let posters='';
let ciba_url = new URL("http://open.iciba.com/dsapi/");		
let response = await request({method: 'GET', url: ciba_url.toString()});
let data = JSON.parse(response);
if (data.sid.length == 0) {
    await new Notice("No data found !");
} else {
	pic= data.fenxiang_img;
	tts=data.tts;
	posters='<div class="cus_pic"><audio id="music"  controls  width="50" src=" '+ tts +'"> </audio><img src="'+ pic +'" referrerpolicy="no-referrer" width="null" height="null" alt="null" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 10px;"></div>'
	return posters;
}
}


```


````ad-flex
 `button-refreshhomepage1`
 `button-loadhome`
```dataviewjs
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let total = parseInt([new Date() - ftMd.ctime] / (60*60*24*1000))
let nofold = '!"88-Template" and !"00-Tips" and !"10-Help"'
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
  let themeday= moment().diff(moment("2020-10-01"), 'days');
	dv.header(4, "🥑Blue Topaz已更新 =="+themeday+"==天");
   dv.header(5, "[如果喜欢请Star⭐](https://github.com/whyt-byte/Blue-Topaz_Obsidian-css)");

```

```dataviewjs
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


```dataviewjs
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{
let posters=history[today].posters;
dv.paragraph(posters);
}

```
````

---
````ad-flex
<!--notice1-->
<p class="stickies" style="max-width:180px" >
<strong>倒计时</strong></br>今年已过去<strong><%+* tR+= moment().diff(tp.date.now("YYYY-1-1"), "days") %></strong>天
</br>距春节还有<strong><%+* let edate = moment("2022-02-01", "yyyy-MM-DD"); let from = moment().startOf('day'); edate.diff(from, "days") >= 0 ? tR += edate.diff(from, "days") : tR += edate.add(1, "year").diff(from, "days") %></strong>天
</p>
<!--notice2-->
<p class="stickies2" style="max-width:200px" >
🌸<br>
每天一个好心情！
</p>
<!--notice3-->
<p class="stickies" style="max-width:200px" >
💖<br>
永远相信美好的事情就要发生
</p>
<!--notice4-->
<p class="stickies2" style="max-width:200px" >
💌<br>
开启美好的一天！
</p>
<!---->

````
---

###  每日一句
````ad-flex
```dataviewjs
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{
let quotes=history[today].quotes;
dv.el("blockquote", quotes);
}

```

```dataviewjs
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".diary-stats")));
let today = moment().format("YYYY-MM-DD");
if (history.hasOwnProperty(today))
{
let music=history[today].music;
dv.el("blockquote", music);
}
```


````

![[从这开始]]

