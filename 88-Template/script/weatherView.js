// Modified from by cuman  from author:@Lumos https://github.com/LumosLovegood/myScripts
// 数据来源：和风天气（https://www.qweather.com/）

//接收传递过来的参数
const key = input.key;
let city = input.city;
let days = input.days;
let icon = input.icon;
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
	let air = await getair(city);
	console.log('weather:'+weather);
	//添加Header
	if(headerLevel!=0){
		dv.header(headerLevel,"最近天气");
	}
	if(icon)
	//天气动画
	weathericon(weather[0].iconDay)
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
		let desc = `今天是${today.date}，${today.textDay}，${today.tempMin}~${today.tempMax}℃  ==${air.category}== 云朵充盈了${today.cloud}%的天空\n顺便，如果有机会看见月亮的话，那么它应该是这样的${today.moonPhase.replace(/[\u4e00-\u9fa5]/g,"")}`;
		dv.el("span",desc);
	}
	//添加另一个城市
	if(anotherCity!=""){
		let anotherWeather = await getWeather(anotherCity,1);
		let cares = `(对了，你关心的那个城市今天的天气是${anotherWeather[0].textDay.replace(/[\u4e00-\u9fa5]/g,"")}，${anotherWeather[0].tempMin}~${anotherWeather[0].tempMax}℃)`;
		dv.el("blockquote",cares);
	}
}
//生成动画
function weathericon(iconDay){
	let weathernum=Number(iconDay);
	let sun_arr=[100,102,103,150,152,153];
		let rain_arr=[300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,350,351,399];
		let windy_arr=[507,508];
		let fog_arr=[500,501,502,503,504,509,510,511,512,513,514,515];
		let cloud_arr=[101,104,151,152,154];
		let snow_arr=[400,401,402,403,404,405,406,407,408,409,410,456,457,499];
		//weather[0].windScale 风力
		
		console.log(cloud_arr.includes(weathernum)) 
		if (sun_arr.includes(weathernum))
			dv.span(sun)
		if (rain_arr.includes(weathernum))
			dv.span(rain)	
		if (windy_arr.includes(weathernum))
			dv.span(windy)
		if (fog_arr.includes(weathernum))
			dv.span(fog)
		if (cloud_arr.includes(weathernum))
			dv.span(cloud)
		if (snow_arr.includes(weathernum))
			dv.span(snow)
		
}
// 获取天气信息
async function getWeather(city,days){
	let locationId = await searchCity(city);
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
async function getair(city){
	let locationId = await searchCity(city);
	console.log('locationId:'+locationId);
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
	let air= data.now;
	return air;
	
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

let rain = `
  <div class="svg-contain">
    <svg class="hurricane-svg" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-437 254.4 85 52.6" style="enable-background:new -437 254.4 85 52.6;" xml:space="preserve">
<path class="cloud" d="M-361.9,280.5c1.4,0,2.6,0.7,3.4,1.7h1.1c0.4-8.2-5.9-10.8-5.9-10.8c-2.2-1.5-5.4-1-5.4-1
    c-0.1-4.1-2.9-7.4-2.9-7.4c-4.7-5.5-10.3-4.9-10.3-4.9c-7.4-0.2-11,5.9-11,5.9c-5.6-4-14.3-2.6-18.2,3.1c-0.7,1.1-1.3,2.2-1.8,3.4
    c0,0.1-0.3,1.2-0.4,1.2c3.5-0.6,6.6,1.6,6.6,1.6s1.1-1.1,1.2-1.3c2.4-2.4,5.6-3.6,9-3.2c4.4,0.5,8.5,3,9.9,7.4
    c0.1,0.2,0.8,2.4,0.6,2.4c5.3,0.1,7.3,3.6,7.3,3.6h13.4C-364.5,281.2-363.3,280.5-361.9,280.5z"/>
<path class="cloud" d="M-386,279.6c-0.2,0-0.4,0-0.6,0.1c-0.1-0.8-0.2-1.7-0.4-2.4c-0.3-1-0.8-2-1.4-2.9c-2-2.9-5.3-4.8-9-4.8
    c-2.3,0-4.4,0.7-6.1,1.9c-0.6,0.4-1.1,0.8-1.6,1.3c-0.2,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.6,0.8c-1.8-1.2-3.9-1.9-6.2-1.9
    c-5.5,0-10,4-10.8,9.3c-3.5,1-6.1,3.9-6.6,7.6h26.3h12.7h2.3l4.7-6.2c0.6-0.8,1.7-0.9,2.5-0.3s0.9,1.7,0.3,2.5l-3.1,4h0.5h5.6h0.7
    c0.1,0,0.2-0.4,0.2-1.1C-377.4,283.5-381.3,279.6-386,279.6z"/>
<polyline class="lightening" points="-382.8,284.2 -387.9,290.9 -380.6,291.2 -387.9,302 "/>
<path class="line" d="M-426.9,294.4l-5.1,7.3"/>
<path class="line" d="M-420.8,294.4l-5.1,7.3"/>
<path class="line" d="M-415.4,294.4l-5.1,7.3"/>
<path class="line" d="M-409.9,294.4l-5.1,7.3"/>
<path class="line" d="M-404.5,294.4l-5.1,7.3"/>
<path class="line" d="M-399.1,294.4l-5.1,7.3"/>
<path class="line" d="M-393.7,294.4l-5.1,7.3"/>
<path class="line" d="M-388.2,294.4l-5.1,7.3"/>
<g>
    <path class="little-path path-1" d="M-374.8,287.2h10.6"/>
    <path class="little-path path-2" d="M-373.8,289.3h10.9"/>
    <path class="big-path" d="M-376,288.3c0,0,14,0,14,0c1.7,0,3.1-1.4,3.3-3.1c0-0.5,0-1-0.3-1.4c-0.9-2.3-4.1-2.7-5.6-0.7
        c-0.4,0.6-0.7,1.3-0.7,1.9"/>
    <path class="little-path path-3" d="M-364.1,285c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2"/>
</g>
</svg>
  </div>`;
let sun = `  <div class="svg-contain">
    <svg version="1.1" class="clear-sky-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 72.3 52.6" style="enable-background:new 0 0 72.3 52.6;" xml:space="preserve">
	<g>
		<path class="sun" d="M50.8,25.7c0,7.9-6.4,14.4-14.4,14.4s-14.4-6.4-14.4-14.4s6.4-14.4,14.4-14.4S50.8,17.8,50.8,25.7z"/>
	<path  class="line big-path line-1" d="M54.5,25.8h6"/>
	<path class="line big-path line-2" d="M12.4,25.8h6"/>
	<path class="line big-path line-3" d="M36.5,44.3v6"/>
	<path class="line big-path line-4" d="M36.5,8.2v-6"/>
	<path class="line big-path line-5" d="M23,38.8l-4.8,4.8"/>
	<path class="line big-path line-6" d="M54.9,8.9L50,13.8"/>
	<path class="line big-path line-7" d="M50,38.8l4.4,4.4"/>
	<path class="line big-path line-8" d="M18.8,9.6l4.2,4.2"/>
	</g>
</svg>
  </div>`;
 let windy =` <div class="svg-contain">
    <svg version="1.1" class="windy-svg" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-447 254.4 64 52.6" style="enable-background:new -447 254.4 64 52.6;" xml:space="preserve">
<g id="Layer_1_1_">
    <g>
        <path class="st0 little-path path-1" d="M-429.2,276.8h6.3"/>
        <path class="big-path big-path-1" d="M-438.1,279.3c0,0,20.5,0,20.6,0c4.1,0,7.4-3.4,7.7-7.4c0.1-1.1-0.1-2.3-0.6-3.3c-2.2-5.4-9.8-6.3-13.3-1.7
            c-1,1.3-1.6,3-1.7,4.6"/>
        <path class="little-path path-2" d="M-422.6,271.7c0-2.8,2.3-5.1,5.1-5.1s5.1,2.3,5.1,5.1c0,2.8-2.3,5.1-5.1,5.1"/>
    </g>
    <g>
        <path class="little-path path-3" d="M-434.1,284.9h30.4"/>
        <path class="little-path path-4" d="M-410.6,280h8.7"/>
        <path class="big-path big-path-2" d="M-442.9,282.7h44c3.6,0,6.6,3,6.8,6.5c0.1,1-0.1,2-0.5,3c-2,4.8-8.7,5.5-11.8,1.5c-0.9-1.2-1.4-2.6-1.5-4.1"
            />
        <path class="little-path path-5" d="M-403.4,289.4c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5s-2-4.5-4.5-4.5"/>
    </g>
</g>
</svg>
  </div>`;
  
  let cloud=`<div class="svg-contain">
    <svg class="overcast-clouds" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 82.6 52.3" style="enable-background:new 0 0 82.6 52.3;" xml:space="preserve">
<g id="Layer_1">
	<path class="cloud-still" d="M21.8,24.2c0.1,0,0.3-1.1,0.4-1.2c0.5-1.2,1.1-2.4,1.8-3.4c3.9-5.7,12.6-7.1,18.2-3.1c0,0,3.7-6,11-5.9
		c0,0,5.6-0.6,10.3,4.9c0,0,2.8,3.3,2.9,7.4c0,0,3.2-0.5,5.4,1c0,0,6.2,2.6,5.9,10.8H56.3c0,0-2-3.5-7.3-3.6c0.2,0-0.5-2.2-0.6-2.4
		c-1.4-4.4-5.5-6.9-9.9-7.4c-3.4-0.4-6.6,0.8-9,3.2c-0.1,0.1-1.2,1.3-1.2,1.3S25.3,23.6,21.8,24.2z"/>
	<path class="cloud-still" d="M57.6,40.7c0-4.8-3.9-8.6-8.6-8.6c-0.2,0-0.4,0-0.6,0.1c-0.1-0.8-0.2-1.7-0.4-2.4c-0.3-1-0.8-2-1.4-2.9
		c-2-2.9-5.3-4.8-9-4.8c-2.3,0-4.4,0.7-6.1,1.9c-0.6,0.4-1.1,0.8-1.6,1.3c-0.2,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.6,0.8
		c-1.8-1.2-3.9-1.9-6.2-1.9c-5.5,0-10,4-10.8,9.3c-3.5,1-6.1,3.9-6.6,7.6h26.3h12.7h12.9h0.7C57.6,41.8,57.6,41.4,57.6,40.7z"/>
</g>
<g id="Layer_2">
</g>
</svg></div>`;
  
  let snow =`<div class="svg-contain">
    <svg version="1.1" class="snow-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 70.3 52.6" style="enable-background:new 0 0 70.3 52.6;" xml:space="preserve">
<g id="Layer_1">
	<path class="cloud" d="M63.9,30.9c0-5.2-4.2-9.4-9.4-9.4c-0.2,0-0.4,0.1-0.7,0.1c-0.1-0.9-0.2-1.8-0.5-2.7c-0.3-1.1-0.9-2.2-1.5-3.1
		c-2.1-3.2-5.8-5.3-9.9-5.3c-2.5,0-4.8,0.7-6.7,2c-0.6,0.4-1.2,0.9-1.8,1.5c-0.3,0.3-0.5,0.6-0.8,0.8c-0.2,0.3-0.5,0.6-0.7,0.9
		c-1.9-1.3-4.2-2.1-6.7-2.1c-6,0-10.9,4.4-11.8,10.1c-3.8,1.1-6.7,4.3-7.2,8.3h28.7h13.9H63h0.8C63.9,32.1,63.9,31.7,63.9,30.9z"/>
	<g class="snowflake">
		<line class="snowflake-path big-path" x1="10.3" y1="37" x2="10.3" y2="43.5"/>
		<line class="snowflake-path big-path" x1="13.5" y1="40.3" x2="7" y2="40.3"/>
		<g>
			<line class="snowflake-path big-path" x1="12.6" y1="38" x2="8" y2="42.6"/>
			<line class="snowflake-path big-path" x1="12.6" y1="42.6" x2="8" y2="38"/>
		</g>
	</g>
	<g class="snowflake">
		<line class="snowflake-path big-path" x1="22.7" y1="37" x2="22.7" y2="43.5"/>
		<line class="snowflake-path big-path" x1="25.9" y1="40.3" x2="19.4" y2="40.3"/>
		<g>
			<line class="snowflake-path big-path" x1="25" y1="38" x2="20.4" y2="42.6"/>
			<line class="snowflake-path big-path" x1="25" y1="42.6" x2="20.4" y2="38"/>
		</g>
	</g>
	<g class="snowflake">
		<line class="snowflake-path big-path" x1="35.2" y1="37" x2="35.2" y2="43.5"/>
		<line class="snowflake-path big-path" x1="38.4" y1="40.3" x2="31.9" y2="40.3"/>
		<g>
			<line class="snowflake-path big-path" x1="37.5" y1="38" x2="32.9" y2="42.6"/>
			<line class="snowflake-path big-path" x1="37.5" y1="42.6" x2="32.9" y2="38"/>
		</g>
	</g>
	<g class="snowflake">
		<line class="snowflake-path big-path" x1="48.3" y1="37" x2="48.3" y2="43.5"/>
		<line class="snowflake-path big-path" x1="51.6" y1="40.3" x2="45" y2="40.3"/>
		<g>
			<line class="snowflake-path big-path" x1="50.6" y1="38" x2="46" y2="42.6"/>
			<line class="snowflake-path big-path" x1="50.6" y1="42.6" x2="46" y2="38"/>
		</g>
	</g>
	<g class="snowflake">
		<line class="snowflake-path big-path" x1="60.5" y1="37" x2="60.5" y2="43.5"/>
		<line class="snowflake-path big-path" x1="63.7" y1="40.3" x2="57.2" y2="40.3"/>
		<g>
			<line class="snowflake-path big-path" x1="62.8" y1="38" x2="58.2" y2="42.6"/>
			<line class="snowflake-path big-path" x1="62.8" y1="42.6" x2="58.2" y2="38"/>
		</g>
	</g>
    <g class="snowflake">
        <line class="snowflake-path big-path" x1="10.3" y1="37" x2="10.3" y2="43.5"/>
        <line class="snowflake-path big-path" x1="13.5" y1="40.3" x2="7" y2="40.3"/>
        <g>
            <line class="snowflake-path big-path" x1="12.6" y1="38" x2="8" y2="42.6"/>
            <line class="snowflake-path big-path" x1="12.6" y1="42.6" x2="8" y2="38"/>
        </g>
    </g>
    <g class="snowflake">
        <line class="snowflake-path big-path" x1="22.7" y1="37" x2="22.7" y2="43.5"/>
        <line class="snowflake-path big-path" x1="25.9" y1="40.3" x2="19.4" y2="40.3"/>
        <g>
            <line class="snowflake-path big-path" x1="25" y1="38" x2="20.4" y2="42.6"/>
            <line class="snowflake-path big-path" x1="25" y1="42.6" x2="20.4" y2="38"/>
        </g>
    </g>
    <g class="snowflake">
        <line class="snowflake-path big-path" x1="35.2" y1="37" x2="35.2" y2="43.5"/>
        <line class="snowflake-path big-path" x1="38.4" y1="40.3" x2="31.9" y2="40.3"/>
        <g>
            <line class="snowflake-path big-path" x1="37.5" y1="38" x2="32.9" y2="42.6"/>
            <line class="snowflake-path big-path" x1="37.5" y1="42.6" x2="32.9" y2="38"/>
        </g>
    </g>
    <g class="snowflake">
        <line class="snowflake-path big-path" x1="48.3" y1="37" x2="48.3" y2="43.5"/>
        <line class="snowflake-path big-path" x1="51.6" y1="40.3" x2="45" y2="40.3"/>
        <g>
            <line class="snowflake-path big-path" x1="50.6" y1="38" x2="46" y2="42.6"/>
            <line class="snowflake-path big-path" x1="50.6" y1="42.6" x2="46" y2="38"/>
        </g>
    </g>
    <g class="snowflake">
        <line class="snowflake-path big-path" x1="60.5" y1="37" x2="60.5" y2="43.5"/>
        <line class="snowflake-path big-path" x1="63.7" y1="40.3" x2="57.2" y2="40.3"/>
        <g>
            <line class="snowflake-path big-path" x1="62.8" y1="38" x2="58.2" y2="42.6"/>
            <line class="snowflake-path big-path" x1="62.8" y1="42.6" x2="58.2" y2="38"/>
        </g>
    </g>
</g>
</svg>
  </div>`;
  
  let fog=`<div class="svg-contain">
    <svg class="fog-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 68 52.6" style="enable-background:new 0 0 68 52.6;" xml:space="preserve">
<g id="Layer_1">
	<g>
		<path class="cloud st3" d="M62.8,29.3c0-5.2-4.2-9.4-9.4-9.4c-0.2,0-0.4,0.1-0.7,0.1c-0.1-0.9-0.2-1.8-0.5-2.7c-0.3-1.1-0.9-2.2-1.5-3.1
        C48.6,11,44.9,9,40.8,9c-2.5,0-4.8,0.7-6.7,2c-0.6,0.4-1.2,0.9-1.8,1.5c-0.3,0.3-0.5,0.6-0.8,0.8c-0.2,0.3-0.5,0.6-0.7,0.9
        c-1.9-1.3-4.2-2.1-6.7-2.1c-6,0-10.9,4.4-11.8,10.1c-3.8,1.1-6.7,4.3-7.2,8.3h28.7h13.9h14.1h0.8C62.7,30.6,62.8,30.1,62.8,29.3z"
        />
    <path class="fog-line big-path" d="M7.3,28.8h12.4"/>
    <path class="fog-line big-path" d="M23.5,28.8h38.4"/>
    <path class="fog-line big-path" d="M57.3,32.6h5.2"/>
    <path class="fog-line big-path" d="M31.2,32.6h22.1"/>
    <path class="fog-line big-path" d="M6.2,32.6h21.1"/>
    <path class="fog-line big-path" d="M11.4,43.6H6.2"/>
    <path class="fog-line big-path" d="M37.5,43.6H15.4"/>
    <path class="fog-line big-path" d="M62.5,43.6H41.4"/>
    <path class="fog-line big-path" d="M6.2,36.4h2.1"/>
    <path class="fog-line big-path" d="M11.9,36.4h6"/>
    <path class="fog-line big-path" d="M21.8,36.4h20.4"/>
    <path class="fog-line big-path" d="M46.3,36.4h16.1"/>
    <path class="fog-line big-path" d="M55.2,40.2h7.3"/>
    <path class="fog-line big-path" d="M48.3,40.2h2.8"/>
    <path class="fog-line big-path" d="M37.3,40.2H44"/>
    <path class="fog-line big-path" d="M18.3,40.2h15.3"/>
    <path class="fog-line big-path" d="M6.2,40.2h8"/>
	</g>
</g>

</svg>
  </div>`;
  