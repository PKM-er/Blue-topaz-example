// author:@Lumos
// 数据来源：和风天气（https://www.qweather.com/）

//接收传递过来的参数
const key = input.key;
let city = input.city;
let days = input.days;
let addDesc = input.addDesc;
let onlyToday = input.onlyToday;
let headerLevel = input.headerLevel;
let anotherCity = input.anotherCity;

// 当onlyToday为true时执行
const now = window.moment();
if(onlyToday){
	// 判断当前时间与文件创建时间是否一致
	if (dv.current().file.cday.ts==dv.date(now.format("gggg-MM-DD")).ts){
		weatherView();
	}
}else{
	weatherView();
}

// 创建视图的主函数
async function weatherView(){
	let weather = await getWeather(city,days);
	
	//添加Header
	if(headerLevel!=0){
		dv.header(headerLevel,"最近天气");
	}
	//生成表格视图
	if(days!=1){
		dv.paragraph(`${city} 最近 ${days} 天的天气如下，参考天气制定你的计划吧！`);
		dv.table(["日期","天气","温度","云量","月相"],weather.map(t => [t.fxDate.substring(5),t.textDay,t.tempMin+"~"+t.tempMax+"℃",t.cloud+"%",t.moonPhase]));
	}else{
		addDesc=true;
	}

	//添加描述
	if (addDesc){
		let today = weather[0];
		today.date = now.format("gggg年MM月DD日");
		let desc = `今天是${today.date}，${today.textDay}，${today.tempMin}~${today.tempMax}℃\n云朵充盈了${today.cloud}%的天空\n顺便，如果有机会看见月亮的话，那么它应该是这样的${today.moonPhase.replace(/[\u4e00-\u9fa5]/g,"")}`;
		dv.el("blockquote",desc);
	}
	//添加另一个城市
	if(anotherCity!=""){
		let anotherWeather = await getWeather(anotherCity,1);
		let cares = `(对了，你关心的那个城市今天的天气是${anotherWeather[0].textDay.replace(/[\u4e00-\u9fa5]/g,"")}，${anotherWeather[0].tempMin}~${anotherWeather[0].tempMax}℃)`;
		dv.el("blockquote",cares);
	}
}

// 获取天气信息
async function getWeather(city,days){
	let locationId = await searchCity(city);
	let weatherUrl = `https://devapi.qweather.com/v7/weather/7d?location=${locationId}&key=${key}`;
	let wUrl = new URL(weatherUrl);
 	const res = await request({
		url: wUrl.href,
		method: "GET",
 	});
	let data = JSON.parse(res);
	if(data.code!="200"){
	 	return -1;
 	}
	let weather= data.daily.slice(0,days);
	
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

//查询城市ID
async function searchCity(city){
	let searchUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${city}&key=${key}&number=1`;
	let sUrl = new URL(searchUrl);
	const res = await request({
		url: sUrl.href,
		method: "GET",
 	});
	let data = JSON.parse(res);
	if(data.code=="200"){
	return data.location[0].id;
 }
 	return -1;
}