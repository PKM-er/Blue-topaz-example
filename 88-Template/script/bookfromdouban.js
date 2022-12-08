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
 
function isNotEmptyStr(s) {
	s = s.trim();	
	if (typeof s == 'string' && s.length > 0) {
        return true
	}
	return false
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
	let $2 = z => doc.querySelectorAll(z);
    let author = '';
    let bookname = '';
    bookname = $("meta[property='og:title']")?.content

    //author = $("meta[property='book:author']")?.content
    // let intro_class_list = $2(".intro");
    // let intro = '';
    // if (intro_class_list) {
        // intro = $("#link-report .intro").innerText;
        // let regx = /<[^>]*>|<\/[^>]*>/gm;
        // if (intro) {
			// intro = intro.replace('(展开全部)', "");
            // intro = intro.replace(regx, "").trim();
            // intro = intro.replace(/\s\s\s\s/gm, "\n");
			// intro = intro.replace(/=*/gm, "");
			
        // }
	// }

	//原文摘录和作者简介 from https://github.com/LumosLovegood/myScripts/blob/main/DoubanAllInOne/doubanInOne.js
	let intro = '';
    let authorintro = " ";
    var temp1 = $("h2");
    if(temp1.innerText.includes("内容简介")){
        var temp2 = temp1.nextElementSibling.querySelectorAll("div.intro")
        var temp3 = temp2[temp2.length-1].querySelectorAll("p");
        for(var i=0;i<temp3.length;i++){
            intro = intro+temp3[i]?.textContent+"\n";
        }
        try{
            temp2 = $2("h2")[1].nextElementSibling.querySelectorAll("div.intro");
            temp3 = temp2[temp2.length-1].querySelectorAll("p");
            for(var i=0;i<temp3.length;i++){
                authorintro = authorintro+temp3[i]?.textContent+"\n";
            }
        }catch(e){
            new Notice("没有作者简介");
        }        
    }else if(temp1.innerText.includes("作者简介")){
        var temp2 = temp1.nextElementSibling.querySelectorAll("div.intro")
        var temp3 = temp2[temp2.length-1].querySelectorAll("p");
        for(var i=0;i<temp3.length;i++){
            authorintro = authorintro+temp3[i]?.textContent+"\n";
        }
    }
	//	console.log(authorintro,'11')
    //原文摘录
    let quote1 = " ";
    let quote2 = " ";
    let quoteList = $2("figure");
    let sourceList = $2("figcaption");
    if(quoteList.length!=0){
        quote1 = quoteList[0]?.childNodes[0]?.textContent.replace(/(\r\n|\n)[\t\s]*(\r\n|\n)/g,"\n").replace(/[ 　]+/g,"").replace(/\(/g,"").trim()+"\n"+sourceList[0]?.textContent.replace(/\s/g,"").trim();
		if(quoteList[1])
        quote2 = quoteList[1]?.childNodes[0]?.textContent.replace(/(\r\n|\n)[\t\s]*(\r\n|\n)/g,"\n").replace(/[ 　]+/g,"").replace(/\(/g,"").trim()+"\n"+sourceList[1]?.textContent.replace(/\s/g,"").trim();
    }
	//console.log(quoteList,'22')
	/*******************************************/
	intro=isNotEmptyStr(intro)?intro.replace(/<[^>]*>|<\/[^>]*>/gm, "").trim().replace(/\s\s\s\s/gm, "\n").replace(/=*/gm, ""):' ';
	authorintro=isNotEmptyStr(authorintro)?'> [!tip]- **作者简介**\n>\n'+authorintro:' ';
	quote1=isNotEmptyStr(quote1)?'> [!quote]- **原文摘录**\n>\n'+'>>'+quote1:' ';
	quote2=isNotEmptyStr(quote2)?'>\n>> '+quote2:' ';

	let bookinfo = {};
	let regauthor= /作者:([\s\S]*)(?=出版社:)/g;
	let regpagecount = /页数:.(\d*)/g;
	let regpublish = /出版社:\W(.*)/g;
	let regpublishyear = /出版年:\W(.*)/g;
	let str =$("#info")?.innerText;
	author= regauthor.exec(str)
	author=(author==null)?'未知':author[1].trim().replace(/\n|\r/g,"").replace(/\ +/g,"");
	let pages=regpagecount.exec(str);
	bookinfo.pagecount=(pages==null)?'0':pages[1].trim();
	let publish=regpublish.exec(str);
	bookinfo.publish=(publish==null)?'未知':publish[1].trim();
	let publishyear=regpublishyear.exec(str);
	bookinfo.publishyear=(publishyear==null)?'未知':publishyear[1].trim();
	//bookinfo.publish=regpublish.exec(str)[1]?.trim()??'未知';
	bookinfo.bookname =bookname;
	bookinfo.filename =bookname.replace(/(^\s*)|\^|\.|\*|\?|\!|\/|\\|\$|\#|\&|\||,|\[|\]|\{|\}|\(|\)|\-|\+|\=|(\s*$)/g, "").replace(/[\\\\/:*?\"<>|]/g,"_");
	bookinfo.cover = $("meta[property='og:image']")?.content;
	bookinfo.type = 'book';
	bookinfo.description = $("meta[property='og:description']")?.content;
	bookinfo.douban_url = $("meta[property='og:url']")?.content;
	bookinfo.author = "'"+ author +"'";  
	bookinfo.isbn =  $("meta[property='book:isbn']")?.content;
	bookinfo.rating = $("#interest_sectl > div > div.rating_self > strong")?.textContent??'-';
	bookinfo.intro = intro;
	bookinfo.authorintro =authorintro;
	bookinfo.quote1=quote1;
    bookinfo.quote2=quote2;
   for(var i in bookinfo){
        if(bookinfo[i]=="" || bookinfo[i]== null){
            bookinfo[i]="未知";
        }
    }
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
    let title = $("div.subject-info span")?.textContent;
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
