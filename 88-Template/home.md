---
cssclass: fullwidth,noyaml,noscroll,myhome
banner: https://www.todaybing.com/api/hd
banner_x: 0.6
banner_y: 0.63001
---

 <div style=" margin-top: -110px;"> <div style="float:left"><%+ tp.date.now("A好，今天是YYYY年MM月Do dddd") %></div> <iframe style="float:right; margin-top:3px" width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="https://i.tianqi.com?c=code&id=34&bdc=%23&icon=4&site=14"></iframe>
</div>
</div> <br><br>		

```dataviewjs
//在Ob中获取每日词霸
//首发于Blue topaz Examples 
//转发请注明出处谢谢
let content='';
let pic='';
let tts='';
let exec = require('child_process').exec; 
let cmdStr = 'curl http://open.iciba.com/dsapi/';
await exec(cmdStr, function(err,stdout,stderr){
    if(err) {
        console.log('get api error:'+stderr);
    } else {
        var data = JSON.parse(stdout);
		pic= data.fenxiang_img;
		tts=data.tts;
	content='<div class="cus_pic"><audio id="music"  controls  width="50" src=" '+ tts +'"> </audio><img src="'+ pic +'" referrerpolicy="no-referrer" width="null" height="null" alt="null" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border-radius: 10px;"></div>'
        //console.log(data);
		dv.paragraph(content);
    }
});


```



%%
<p class="stickies" >
<strong>倒计时</strong></br>距新年还有<strong><%+* let edate = moment("2022-01-01", "yyyy-MM-DD"); let from = moment().startOf('day'); edate.diff(from, "days") >= 0 ? tR += edate.diff(from, "days") : tR += edate.add(1, "year").diff(from, "days") %></strong>天
</br>距春节还有<strong><%+* let edate = moment("2022-02-01", "yyyy-MM-DD"); let from = moment().startOf('day'); edate.diff(from, "days") >= 0 ? tR += edate.diff(from, "days") : tR += edate.add(1, "year").diff(from, "days") %></strong>天
</p>
%%

![[Pasted image 20211229171215.png|inlL|100]]

<br>


````ad-col2
```dataviewjs
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let total = parseInt([new Date() - ftMd.ctime] / (60*60*24*1000))
let nofold = '!"模板" and !"Day Planners" and !"脚本" and !"附件"'
let allFile = dv.pages(nofold).file
let totalMd = "📄 =="+
	allFile.length+"== 篇不知所云的文档"
let totalTag = "=="+allFile.etags.distinct().length+"== 个乱七八糟的标签"
let totalTask = "=="+allFile.tasks.length+"== 个已荒废的事项"
dv.header(4, "您已在Ob上浪费了 =="+total+"== 天")
dv.header(5, totalMd)
dv.header(5, "🔖 "+totalTag)
dv.header(5, "🕗 " + totalTask)
dv.paragraph('<br>')

async function get_BlueTopaz() 
{
let url='https://api.github.com/repos/whyt-byte/Blue-Topaz_Obsidian-css';
   let finalURL = new URL(url);
   let result='';
   let str='';
	result=await  fetch(finalURL, {
		method: 'GET',mode:'cors',
	headers: {
		'User-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.87 Safari/537.36'
		}
	}).then(async (res) => await res.json());
let created_at = result['created_at'];
let updated_at = result['pushed_at'];
let created_date=moment(created_at).utcOffset(8).format('YYYY-MM-DD HH:mm:ss');
let updated_date=moment(updated_at).utcOffset(8).format('YYYY年MM月DD日 HH:mm:ss');

let lastday= moment().diff(moment(updated_at).utc().format('YYYY-MM-DD'), 'days');
if(updated_date){
if(lastday==0)
{
dv.header(5, "🎉🎉🎉**BT主题今天更新啦！**")
dv.header(5, "📅更新日期"+updated_date)
}else
{
dv.header(5, "🚀距离最后一次更新已过去=="+lastday +"==天")
dv.header(5, "📅更新日期"+updated_date)
}
dv.header(5, "[如果喜欢请Star⭐](https://github.com/whyt-byte/Blue-Topaz_Obsidian-css)")
}
}

let themeday= moment().diff(moment("2020-10-01"), 'days');
dv.header(4, "🥑Blue Topaz已持续更新 =="+themeday+"==天");
await get_BlueTopaz();

```
`````


###  每日一句
````ad-col2

```dataviewjs
//在Ob中获取hitokoto 一言
let caller;
async function getinfo() 
{
caller && clearTimeout(caller);
let url='https://v1.hitokoto.cn/?encode=json&c=d&c=i';
   let finalURL = new URL(url);
   let result='';
   let str='';
	result=await  fetch(finalURL, {
		method: 'GET',mode:'cors',
	headers: {
			'Content-Type': 'application/json',
			 'Access-Control-Allow-Origin':'*'
		}
	}).then(async (res) => await res.json());
	let who =result['from_who'];
		 if(!who) who =' ';
  const new_content = `${result['hitokoto']} <br> <em style="display: inline-block;text-indent: 6em;"> &mdash; 来自 ${who}  《${result['from']}》</em>`; 
  dv.el("blockquote", new_content);
}
caller=setTimeout(
await getinfo()
,1000);
dv.paragraph('<br>');

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


let music_id='1819970423';
let iframe='';
async function getmusicinfo() 
{
caller && clearTimeout(caller);
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
		return music_id;
	}
}

caller = setTimeout(
await getmusicinfo()
,500);
 iframe='<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="https://music.163.com/outchain/player?type=2&id='+music_id+'&auto=0&height=66"></iframe>' ;

dv.el("blockquote", iframe);
```

````


![[从这开始]]


<br>

