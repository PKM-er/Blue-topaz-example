---
UID: 20221021212922 
aliases: 
tags: 
source: 
cssclass: 
created: 2022-10-21
---

## ✍内容

```dataviewjs
function getRepeatNum(arr){ 
        var obj = {}; 
        for(var i= 0, l = arr.length; i< l; i++){ 
            var item = arr[i]; 
            obj[item] = (obj[item] +1 ) || 1; 
        } 
        return obj; 
    }

 let yamlvalues=dv.pages("#book").file.frontmatter.values;
 let res=[];
Object.keys(yamlvalues).forEach(function (key) { 
let yaml=yamlvalues[key];
Object.keys(yaml).forEach(function (key){
res.push(key)
});
  });
let result=getRepeatNum(res)
let str =''
    for(var key in result){
        str +=key +'('+ result[key] +') '
        }
dv.paragraph(str);
dv.paragraph(result);
```

