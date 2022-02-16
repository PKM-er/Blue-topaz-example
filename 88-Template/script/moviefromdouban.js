//2022-02-15 by Cuman
//脚本可以从获取网址信息，访问豆瓣电影网站抓取电影基本信息字段。

const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

module.exports = moviefromdouban

let QuickAdd;

async function moviefromdouban(params) {
  QuickAdd = params;
  const http_reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  const http_reg_movie = /(http:\/\/movie|https:\/\/movie)((\w|=|\?|\.|\/|&|-)+)/g;
  const query = await QuickAdd.quickAddApi.inputPrompt(
    "请输入豆瓣电影网址:"
  );
  if (!query) {
    notice("No url entered.");
    throw new Error("No url entered.");
  }
if (!http_reg.exec(query)) {
 new Notice('复制的内容需要包含网址', 3000);
 throw new Error("No results found.");
}

 const url = query.match(http_reg)[0];
    console.log(url);
if (http_reg_movie.exec(url)) {
	let moviedata = await getmovieByurl(url);
	if(moviedata)
	new Notice('电影数据获取成功！', 3000);
  QuickAdd.variables = {
    ...moviedata
  };
}else
{
 new Notice('只能解析movie.douban.com相关网址', 3000);
 throw new Error("No results found.");
}
 }	 


async function getmovieByurl(url) {

 let page = await urlGet(url);

   if (!page) {
    notice("No results found.");
    throw new Error("No results found.");
  }
    let p = new DOMParser();
    let doc = p.parseFromString(page, "text/html");
    let $ = s => doc.querySelector(s);
    let director = '';
    let moviename = '';
    moviename = $("meta[property='og:title']")?.content
    director = $("meta[property='video:director']")?.content
	summary = $("span[property='v:summary']").textContent??'-';
	genre = $("span[property='v:genre']").textContent??'-';
	console.log(genre)
	let regx = /<[^>]*>|<\/[^>]*>/gm;
	if (summary) {
			summary = summary.replace('(展开全部)', "");
            summary = summary.replace(regx, "").trim();
            summary = summary.replace(/\s\s\s\s/gm, "\n");
			
        }
	let movieinfo = {};
	movieinfo.fileName =moviename;
	movieinfo.Poster = $("meta[property='og:image']")?.content;
	movieinfo.type = 'movie';
	movieinfo.description = $("meta[property='og:description']")?.content;
	movieinfo.douban_url = $("meta[property='og:url']")?.content;
	movieinfo.director = "'"+ director +"'";  
	movieinfo.genre =  genre;
	movieinfo.rating = $("#interest_sectl > div > div.rating_self > strong")?.textContent??'-';
	movieinfo.plot = summary;
	movieinfo.runtime =  $("span[property='v:runtime']")?.textContent??'-';
	movieinfo.year = $("span[property='v:initialReleaseDate']")?.textContent??'-';
	movieinfo.banner= movieinfo.Poster.replace('s_ratio_poster', "1");
	
  return movieinfo;
}

async function urlGet(url) {
  let finalURL = new URL(url);
  let headers = {
'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.100.4758.11 Safari/537.36'
};
  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
  
  return res;


}


