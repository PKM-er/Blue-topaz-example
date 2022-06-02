//----------------------------------------------------
// author： cuman
//plugin: https://github.com/cumany/obsidian-echarts
// date: 2022-06-12
// source： https://github.com/cumany/Blue-topaz-examples
//----------------------------------------------------

const text = input.text;
const filename = input.filename
const container = input.container;
const stopwords_path = input.stopwords_path;
async function removeMarkdown (text) {
    let excludeComments= true //排除注释
    let excludeCode= true //排除代码块
    let plaintext = text
    if (excludeComments) {
     plaintext = plaintext
    .replace(/<!--.*?-->/sg, "")
    .replace(/%%.*?%%/sg, "");
    }
    if (excludeCode) {
    plaintext = plaintext
    .replace(/```([\s\S]*)```[\s]*/g, "");
    
    }
     plaintext = plaintext
    .replace(/`\$?=[^`]+`/g, "") // inline dataview
    .replace(/^---\n.*?\n---\n/s, "") // YAML Header
    .replace(/!?\[(.+)\]\(.+\)/g, "$1") // URLs & Image Captions
    .replace(/\*|_|\[\[|\]\]|\||==|~~|---|#|> |`/g, ""); // Markdown Syntax
    return plaintext;
    }

  async function filter_stopwords (stopwords_path,cutresult) { 
      let stopwords =''
      //查看文件是否存在
      let result=[];
        await app.vault.adapter.read(stopwords_path).then(async (data) => { 
            stopwords = data.toString();
            stopwords = stopwords.split('\n');
            for (let i = 0; i < cutresult.length; i++) {
                if (stopwords.indexOf(cutresult[i]) == -1) {
                    result.push(cutresult[i]);
                }
            }
            result = result.filter(function (s) { return s && s.trim();})
    })
    return result;
  }

//使用finalFunc()

  let  str=await removeMarkdown(text)
  const  cuter=app.plugins.plugins['cm-chs-patch'].cut.bind(app.plugins.plugins['cm-chs-patch'])
    let cutresult =cuter(str.replace(' ',''))
    
    let datas=await filter_stopwords(stopwords_path,cutresult).then(result => {
      let countedNames = result.reduce((obj, name) => { 
        if (name in obj) {
          obj[name]++
        } else {
          obj[name]=1
        }
        return obj
      }, {})
      return Object.entries(countedNames)
      })

      let newresult = datas.map(vals => ( { name: vals[0],value: vals[1] }) );
      const search='content' // content 
      newresult.forEach((data)=>{
          data['search']=search
          data['file']=filename
      })
      var option = {
          tooltip: {},
          series: [{
              type: 'wordCloud',
              width: '100%',
              height: '100%',
              sizeRange: [20, 80],
              rotationRange: [0, 0],
              textPadding: 0,
              autoSize: {
                  enable: true,
                  minSize: 6,
                },
              layoutAnimation: true,
              textStyle: {
                  fontFamily: 'sans-serif',
                  fontWeight: 'bold',
                  color: function () {
                      // Random color
                      return 'rgb(' + [
                      Math.round(Math.random() * 200) + 50,
                      Math.round(Math.random() * 150),
                       Math.round(Math.random() * 150) + 50
                                  ].join(',') + ')';
                  }
              },
              emphasis: {
                  textStyle: {
                      textShadowBlur: 2,
                      color: '#528'
                  }
              },
              data: newresult
          }]
      }
      app.plugins.plugins['obsidian-echarts'].render(option, container)