//2022-01-28 by Cuman
//脚本可以从获取网址信息，访问豆瓣图书网站抓取图书基本信息字段。

const notice = (msg) => new Notice(msg, 5000);
const log = (msg) => console.log(msg);

module.exports = bookfromdouban

let QuickAdd;

async function bookfromdouban(params) {
  QuickAdd = params;
  const isbn_reg = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/g;
  const http_reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
  const http_reg_book = /(http:\/\/book|https:\/\/book|m)((\w|=|\?|\.|\/|&|-)+)/g;
  let detailurl;	
  const query = await QuickAdd.quickAddApi.inputPrompt(
    "请输入豆瓣图书网址或者ISBN:"
  );

	if (!query) {
    notice("No url entered.");
    throw new Error("No url entered.");
  }
	if (isbn_reg.exec(query)) {
		isbn = query.replace(/-/g, "");
		detailurl= await getBookByisbn(isbn);
	}else
	{	
		 if (!http_reg.exec(query)) {
		 new Notice('复制的内容需要包含网址或者ISBN码', 3000);
		 throw new Error("No results found.");
	}else
		{
		detailurl = query.match(http_reg)[0];
		}
	}
console.log('detailUrl:'+detailurl);
 if (http_reg_book.exec(detailurl)) {
	let bookdata = await getbookByurl(detailurl);
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
    //author = $("meta[property='book:author']")?.content
    let intro_class = $("#link-report .intro");
    let intro = '';
    if (intro_class) {
        intro = $("#link-report .intro").innerText;
        let regx = /<[^>]*>|<\/[^>]*>/gm;
        if (intro) {
			intro = intro.replace('(展开全部)', "");
            intro = intro.replace(regx, "").trim();
            intro = intro.replace(/\s\s\s\s/gm, "\n");
			intro = intro.replace(/=*/gm, "");
			
        }
	}
	
	let bookinfo = {};
	let regauthor= /作者:([\s\S]*)(?=出版社:)/g;
	let regpagecount = /页数:.(\d*)/g;
	let regpublish = /出版社:\W(.*)/g;
	let str =$("#info")?.innerText;
	author= regauthor.exec(str)[1].trim().replace(/\n|\r/g,"").replace(/\ +/g,"")??'未知';
	bookinfo.pagecount=regpagecount.exec(str)[1].trim()??'100';
	bookinfo.publish=regpublish.exec(str)[1].trim()??'未知';
	bookinfo.bookname =bookname.replace(/(^\s*)|\^|\.|\*|\?|\!|\/|\\|\$|\#|\&|\||,|\[|\]|\{|\}|\(|\)|\-|\+|\=|(\s*$)/g, "");
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


async function getBookByisbn(isbn){
    let isbnurl = "https://m.douban.com/search/?query="+isbn;
	let page = await urlGet(isbnurl);

    if (!page) {
    notice("No results found.");
    throw new Error("No results found.");
  }
    let p = new DOMParser();
    let doc = p.parseFromString(page, "text/html");
	let $ = s => doc.querySelector(s);
    let title = $("div.subject-info span").textContent;
    let detailUrl = String($("ul li a").href).replace("app://obsidian.md","https://m.douban.com");
    if (!detailUrl){
        return null;
    }
    return detailUrl;
}
 
async function urlGet(url) {
console.log(url);
  let finalURL = new URL(url);
  const res = await request({
    url: finalURL.href,
    method: "GET",
    cache: "no-cache",
    headers: {
      "Content-Type": "text/html; charset=utf-8",
	  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.100.4758.11 Safari/537.36'
    },
  });
  
  return res;


}
