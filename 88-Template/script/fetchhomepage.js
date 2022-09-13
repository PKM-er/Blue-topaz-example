const CITY = "City name";
module.exports = {
	entry: fetchhomepage,
	settings: {
	  name: "Get Weather",
	  author: "",
	  options: {
		[CITY]: {
		  type: "text",
		  defaultValue: "",
		  placeholder: "Enter the city name",
		},
	  },
	},
  };

let Settings;
let history ;
let today;
async function fetchhomepage (params,settings) {
    ({quickAddApi} = params) 
	Settings = settings;
//查看文件是否存在
 app.vault.adapter.exists(".obsidian/.diary-stats").then(async (exists) => {
            if (!exists) {
                app.vault.adapter.write(".obsidian/.diary-stats", "{}");
            }

});
history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
//查看当天信息
today = moment().format("YYYY-MM-DD");
await updateToday();

}

//获取每日一言信息
//语句接口 (https://developer.hitokoto.cn/sentence/#%E8%AF%B7%E6%B1%82%E5%8F%82%E6%95%B0)
async function getinfo() 
{
      console.log("beigin fetch hitokoto...");
let url='https://v1.hitokoto.cn/?encode=json&c=d&c=i';
   let finalURL = new URL(url);
let response = await request({method: 'GET', url: finalURL.toString()});
let data = JSON.parse(response);
console.log(data)
	if(data.length===0)
	{
		return null;
	}else{
	let who =data['from'];
		 if(!who) who =' ';
  const new_content = `${data['hitokoto'].trim()} <br> <em style="line-height: 2.8;float: right;"> &mdash; 来自 ${who}  《${data['from']}》</em>`; 
  return new_content;
	}
}
//每日一句接口2
async function getinfo2() 
{
      console.log("beigin fetch getinfo2...");
	let url='https://api.xygeng.cn/one';
	  let finalURL = new URL(url);
	  let result='';
	  let str='';
    result=await  fetch(finalURL, {
        method: 'GET',mode:'cors', cache: 'no-cache',
			 headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res) => await res.json());
	
	if(result.length===0)
	{
		return null;
	}else
	{
		
	 const origin =result['data']['origin'];
	 let content =result['data']['content'];
	  content = content.trim();
	  str=` ${content}<br>  <em style="line-height: 3;float: right;">&mdash; 来自 ${origin} </em>`;
	 return str;
	}
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
		iframe='<iframe id="music" frameborder="no" border="0" marginwidth="0" marginheight="0" width=280 height=86 src="https://music.163.com/outchain/player?type=2&id='+music_id+'&auto=0&height=66"></iframe>' ;
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
			const quote1 = await getinfo();
			const quote2 ='';
		//	const quote2 = await getinfo2();
			let quote='';
		if(quote1!=null)
			{   quote=quote1;
				//let quotearr = [quote1,quote2];
				//quote = quotearr[Math.floor(Math.random()*quotearr.length)];
			}else
			{
				quote=" 再困难的事情，你一去做便不再困难了。\n Difficult thing again, you no longer difficult to do.";
			}
		const newDay = {
            quotes: quote,
            posters: await get_ciba(),
           // music: await getmusicinfo(),
            themes: await get_BlueTopaz(),
			weather: await getWeather(Settings[CITY]), //默认是自动获取，如果想获取在quicadd中设置
            state: 0,       
        };
            history[moment().format("YYYY-MM-DD")] = newDay;
			 await update();
        }
        today = moment().format("YYYY-MM-DD");
       
    }
async function update() 
{
 app.vault.adapter.write(".obsidian/.diary-stats", JSON.stringify(history));
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

//获取天气脚本
// Modified by cuman  from author:@Lumos https://github.com/LumosLovegood/myScripts
// 数据来源：和风天气（https://www.qweather.com/）

async function getWeather(city){
	console.log("beigin fetch getWeather..."+city);
	let key='dc0f31ac6f37484f88e3e7d45b84e403'; //尽量换成自己申请的key以免接口失效https://console.qweather.com
	let locationId='';
	let windydesc='';
	if(city)
	{
		let location = await searchCity(city,key);
		locationId =  location.id;
	}else
	{
		let location = await getpos(key);
		locationId =  location.id;
		city = location.name
	}

	let weather = await getQWeather(locationId,key);

	if(weather=='-1')
	{
		return await getWWeather(city);
	}else
	{
		//天气动画
		//weathericon(weather[0].iconDay,Math.max(weather[0].windSpeedDay,weather[0].windSpeedNight))
		weather[0].city=city;
		weather[0].air ='';
		let air = await getair(locationId,key);
		if(air.code==200)
			weather[0].air= '=='+air.now.category+'==';
		let windyspeed =Math.max(weather[0].windSpeedDay,weather[0].windSpeedNight);
		if(windyspeed<12)//小风
		{
		 windydesc = "微风习习";
		}else if(windyspeed<39)//小风
		{
		 windydesc = "清风徐徐";	
		}else 
			windydesc = "有"+today.windDirDay+"风出没，风力"+today.windScaleDay+'级';	

		weather[0].windydesc=windydesc;
		
			return weather;	
	}
}

//wttr 天气入口
async function getWWeather(city)
 {
	if(city=== undefined)
	{
		city='';
	}
  let result = await fetch("https://wttr.in/"+city+"?format=%l:+%c+%t+%w").then(async (res) => await res.text());
  if(result.includes("China"))
	result = result.replace(/:/g,'').replace(/\+/g,'').replace(', China','');
 return result;
 
 }
// 和风天气入口获取天气信息
async function getQWeather(locationId,key){
	

	days=1;
	console.log('locationId:'+locationId);
	let weatherUrl = `https://devapi.qweather.com/v7/weather/3d?location=${locationId}&key=${key}`;
	let wUrl = new URL(weatherUrl);
 	const res = await request({
		url: wUrl.href,
		method: "GET",
 	});
	
	let data = JSON.parse(res);
	if(data.code!="200"){
	 	return -1;
 	}
	 let weather= data.daily;
	//添加表情
	for(let i=0;i<days;i++){
		let textDay = weather[i].textDay;
		let moon = weather[i].moonPhase;
		if(textDay.includes("雨")){
			weather[i].textDay="🌧"+textDay;
		}else if(textDay.includes("云")){
			weather[i].textDay="⛅"+textDay;
		}else if(textDay.includes("晴")){
			weather[i].textDay="🌞"+textDay;
		}else if(textDay.includes("雪")){
			weather[i].textDay="❄"+textDay;
		}else if(textDay.includes("阴")){
			weather[i].textDay="🌥"+textDay;
		}else if(textDay.includes("风")){
			weather[i].textDay="🍃"+textDay;
		}else if(textDay.includes("雷")){
			weather[i].textDay="⛈"+textDay;
		}else if(textDay.includes("雾")){
			weather[i].textDay="🌫"+textDay;
		}
		switch(moon){
			case "新月":
				weather[i].moonPhase="🌑"+moon;
				break;
			case "峨眉月":
				weather[i].moonPhase="🌒"+moon;
				break;
			case "朔月":
				weather[i].moonPhase="🌑"+moon;
				break;
			case "娥眉月":
				weather[i].moonPhase="🌒"+moon;
				break;
			case "上弦月":
				weather[i].moonPhase="🌓"+moon;
				break;
			case "盈凸月":
				weather[i].moonPhase="🌔"+moon;
				break;
			case "满月":
				weather[i].moonPhase="🌕"+moon;
				break;
			case "亏凸月":
				weather[i].moonPhase="🌖"+moon;
				break;
			case "下弦月":
				weather[i].moonPhase="🌗"+moon;
				break;
			default:
				weather[i].moonPhase="🌘"+moon;
		}
	}
	return weather;
}
// 获取空气质量信息
async function getair(locationId,key){

	let weatherUrl = `https://devapi.qweather.com/v7/air/now?location=${locationId}&key=${key}`;
	let wUrl = new URL(weatherUrl);
 	const res = await request({
		url: wUrl.href,
		method: "GET",
 	});
	
	let data = JSON.parse(res);
	if(data.code!="200"){
	 	return -1;
 	}
	let air= data;
	return air;
	
}

//查询位置
async function urlGet(url) {

  let finalURL = new URL(url);
  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      'Content-Type': 'application/json;charset=gb2312',
	  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.100.4758.11 Safari/537.36'
    },
  });
  
  return res;

}
async function getpos(key) {
let result = await urlGet('http://whois.pconline.com.cn/ipJson.jsp?json=true')
 result = JSON.parse(result);
	let city=result.cityCode;
return await searchCity(city,key);
}
//查询城市ID
async function searchCity(city,key){
	let searchUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${key}&number=1`;
	let sUrl = new URL(searchUrl);
	const res = await request({
		url: sUrl.href,
		method: "GET",
 	});
	let data = JSON.parse(res);
	if(data.code=="200"){
	return data.location[0];
 }
 	return -1;
}

