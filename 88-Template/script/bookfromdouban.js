//2022-01-28 by Cuman
//脚本可以从获取网址信息，访问豆瓣图书网站抓取图书基本信息字段。

const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

module.exports = bookfromdouban

let QuickAdd;

async function bookfromdouban(params) {
  QuickAdd = params;
  const http_reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  const http_reg_book = /(http:\/\/book|https:\/\/book)((\w|=|\?|\.|\/|&|-)+)/g;
  const query = await QuickAdd.quickAddApi.inputPrompt(
    "请输入豆瓣图书网址:"
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
 if (http_reg_book.exec(url)) {
	let bookdata = await getbookByurl(url);
	if(bookdata)
	new Notice('图书数据获取成功！', 3000);
  QuickAdd.variables = {
    ...bookdata
  };
}else{
 new Notice('只能解析book.douban.com相关网址', 3000);
 throw new Error("No results found.");
}

 }	 

async function getbookByurl(url) {

 let page = await urlGet(url);

   if (!page) {
    notice("No results found.");
    throw new Error("No results found.");
  }
    let p = new DOMParser();
    let doc = p.parseFromString(page, "text/html");
    let $ = s => doc.querySelector(s);
    let author = '';
    let bookname = '';
    bookname = $("meta[property='og:title']")?.content
    author = $("meta[property='book:author']")?.content
    let intro_class = $("#link-report .intro");
    let intro = '';
    if (intro_class) {
        intro = $("#link-report .intro").innerHTML;
        let regx = /<[^>]*>|<\/[^>]*>/gm;
        if (intro) {
			intro = intro.replace('(展开全部)', "");
            intro = intro.replace(regx, "").trim();
            intro = intro.replace(/\s\s\s\s/gm, "\n");
			
        }
	}
	let bookinfo = {};
	bookinfo.bookname =bookname;
	bookinfo.cover = $("meta[property='og:image']")?.content;
	bookinfo.type = 'book';
	bookinfo.description = $("meta[property='og:description']")?.content;
	bookinfo.douban_url = $("meta[property='og:url']")?.content;
	bookinfo.author = "'"+ author +"'";  
	bookinfo.isbn =  $("meta[property='book:isbn']")?.content;
	bookinfo.rating = $("#interest_sectl > div > div.rating_self > strong")?.textContent??'-';
	bookinfo.intro = intro;


  return bookinfo;
}
//https://book.douban.com/subject/35680662/?icn=index-latestbook-subject
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


