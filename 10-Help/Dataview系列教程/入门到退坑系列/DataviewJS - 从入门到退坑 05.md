---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
````dialogue
left: 😯
right: 🤣
titleMode: all
> 首先——  
< 为啥你明明是“答”却先开口了啊！  
> 好好好。你来。  
< 咳咳。呐，上次的作业，答案给一下。  
> （尖锐）你做了么，就要答案。  
< 呃，做了的，只是……对一下答案。  
> ……喏。

```
dv.list(dv.pages('"Test"').sort(p => p.file.mtime).file.mtime);
```

```
dv.list(dv.pages('"Test"').sort(p => p.file.name.length).file.name);
```

```
function timeFromInDays(p) { 
  return Math.abs(luxon.Interval.fromDateTimes( 
    p.file.ctime, 
    luxon.DateTime.fromISO("2021-08-15") 
  ).length("days"));
} 

dv.list(dv.pages('"Test"').sort(timeFromInDays, 'asc').file.cday);
```

< 你这个最后一个也太坑了吧，谁会有这么奇葩的需求啊？  
> 你不是也从来没有在一个笼子里养过鸡和兔子。  
< 那也……确实。  
> 而且是要多那啥才会分不清鸡和兔子的脚和头啊。  
< 我觉得问题不是分辨哪只是鸡，哪只是兔子，而是数的时候两边都在不停地动，容易数乱。

< anyway。今天讲什么呢，我觉得虽然学了些很复杂的东西，但是还是不太懂怎么组合在一起。而且，只是单纯地列出文件名字之类的，有些无聊。  
> 你想做点什么？  
< 我想想哦……DV里面很容易就能做出一个很多列的很多信息的表格，DVJS还没有讲过怎么弄。就比如我的书单，dv里面是这样的：

```
TABLE
score, author, status FROM "Books" SORT status DESC SORT score DESC 
```

> 嗯，所以是从给定的文件夹里，列出文件名，评分，作者和阅读情况，然后优先按照得分排序，再次按照状态排序[\[1\]](https://publish.obsidian.md/#fn-1-67c9762c6b2546d2)，是嘛。  
< 嗯。然后，我现在有这么两个问题。首先是，我想把这个书单改成“近期书单”，所以希望把创建日期比较久远的文件筛掉。  
> 嗯。  
< 然后，状态排序因为是“读过”，“在读”，“未读”的文字，我想不按拼音顺序，而按照我自己指定的顺序排列。  
> 好，那你小本本拿好了，我们接下来要开复杂一点的内容了。  
< 呃……先讲简单的吧，不管那些新要求，先列表，难么？  
> 没那么难。

```
dv.table(
  ["File", "Score", "Author", "Status"],
  dv.pages('"Books"').sort(p => p.status, 'desc').sort(p => p.score, 'desc')
  .map(p => [p.file.link, p.score, p.author, p.status])
)
```

< 我看看哦……所以首先，这个`dv.table`就是拿来列表的咯？  
> 是的。接受的两个参数，第一个就是表头，第二个则是剩下的列数据。  
< 表头比起原生DV多了一个`File`。  
> 原生DV默认会提供给你链接形式的文件名，这里我们手动提供了。  
< 表头这个我懂了，然后后面这个比较长，我得拆开来看。首先是……`dv.pages('"Books"')`，也就是从这个文件夹里读取页面，嗯这个我熟悉。然后……比想象的简单诶，就是连续两个`sort`。`sort`可以这么串联的嘛？  
> 正确，`sort`和`filter`都是可以任意串联的，两者都会即时对数据进行变形。  
< 之后我就看不懂了。这个`map`……地图？是干啥的？我听人说好像词典什么的就是这个？  
> 编程里常见的Map其实是个多义词，但是追根究底又不是。你说的词典、哈希表都是作为数据结构的Map，用词典来理解很妥当：你要找某个词的意思，就按照索引，直接翻到词典里的某页去读定义。  
< 没听懂。

> 就是个你给他一个东西，它就能返给你对应的一个东西的东西。  
< 更乱了。  
> “螃蟹多少钱一斤？5毛。鳄鱼多少钱一斤？8毛。”  
< 两个例子都有微妙的坐牢要素，不过我大概明白了，就是问答一一对应呗。  
> ……你早说你知道一一对应就不用我这么浪费时间了。Map是用来存储一一对应的数据结构，而作为动词/函数的`map`，则指的是“根据某种规则一个一个地变动”。  
< 再拿螃蟹举个栗子吧，这个我觉得挺亲切的，虽然有点馋了。  
> 假如有一筐螃蟹`crabs`，那么`crabs.map(crab => crab.legs)`就是我每给你一个螃蟹，你就把螃蟹腿给拆下来递回去。最后所有这些螃蟹腿排好，就是了。  
< 没这么卖螃蟹的。不过懂了，那如果我只是每个螃蟹要过一下秤，然后拿一个重量清单，那就是`crabs.map(crab => crab.weight)`咯。  
> 孺子可教也。  
< 匹夫不可夺志也。

< 所以这里，这个map就是说，每给我一个page——也就是一本书的笔记——我就返回一个Array，里面分别是书的文件链接，我给的得分，书的作者，还有阅读状态，然后所有这些array放一起，这个array的array，就是第二个参数咯？  
> 诶，我还没解释Array呢，你就会了？  
< 就一列东西嘛。  
> array的array你也掌握了我是没想到的。  
< 我也是会独立学习的哼唧。嘛，这个内容还是有点多，我先消化消化，更复杂的东西下次再说。  
> 好。
````
___

1.  为什么写出来的DQL和后面的DVJS都是“先排状态再排得分”，但是实际显示却是得分的排序优先级高于状态呢？这个问题很有趣，请自行理解。作为没卵用的提示，JavaScript的设计标准在2019年第十版开始规定，Array的`sort`方法需要实现[稳定性](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)——也就是，排序时不会打乱等价元素原有的顺序。顺带一提，除了IE以外，其他的浏览器都是满足这个规定的[↩︎](https://publish.obsidian.md/#fnref-1-67c9762c6b2546d2)