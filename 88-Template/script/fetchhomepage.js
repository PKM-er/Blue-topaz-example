module.exports = fetchhomepage
let quickAddApi;

async function fetchhomepage (params) {
    ({quickAddApi} = params) 

//查看文件是否存在
 app.vault.adapter.exists(".obsidian/.diary-stats").then(async (exists) => {
            if (!exists) {
                app.vault.adapter.write(".obsidian/.diary-stats", "{}");
            }

});
let history = Object.assign(JSON.parse(await app.vault.adapter.read(".obsidian/.diary-stats")));
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

}
