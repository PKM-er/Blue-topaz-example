---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learningshttps://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
````dialogue
left: 😯
right: 🤣
titleMode: all
< 叔啊，我跟你说实话啊，我看你讲的也不是看不明白，但是我自己上手写东西的时候就，总是各种报错，半天也搞不出来成效，很影响心情啊，咋回事儿呢。  
> 嗯，DVJS再怎么说也是JS，也是门编程语言了，那你现在做的四舍五入一下就是开发了。虽然造的基本都是以前见过的轮子，但是开发该遭的罪都是要遭的；或者说，遭罪就是学习的过程。  
< 呜呜呜。  
> 我跟你大概讲讲怎么调试不好使的东西吧。  
< 行。

> 首先，虽然现代写码的多了很多debugger这类的工具，但是千百年来颠簸不破的调试之真理依然是print-debugging。  
< 什么意思？  
> 你拿不准为什么出错的时候，把代码里可疑或者不可疑的各种变量和对象，都显示出来，看明白了，很多时候就能让你找到问题的所在。在通常的网络开发里用的是`console.log`，在DVJS里面则是`dv.paragraph`，可以起到最基本的显示内容的作用。

< 唔，可疑的变量我可以理解，为啥不可疑的变量也要拿出来看？  
> 如果你判断可疑与否的标准能经得起代码实际运行的考验，也就不需要调试了不是。看不出可疑才会出bug。  
< 好有道理我竟无法反驳。那，变量显示出来，能干什么呢？  
> 有几个方面，首先，确认你要的内容是否实际存在。因为JS的坏毛病是报喜不报忧，很多时候你把一个变量传来传去各种参与运算，殊不知丫的始终都是个`undefined`。  
< 不会报错吗？  
> 强类型的语言，会吧。不幸的是，不论TypeScript，JavaScript绝对是弱类型的语言。你可以看一看这个[吐槽视频](https://www.destroyallsoftware.com/talks/wat)。  
< ……  
> 其次，存在的变量，需要确认其内容是否符合预期。  
< 这个我明白，比如输出时间的格式可能不一样。  
> 嗯，还有，有的时候你以为是字符串的东西可能是其他某种实现了`toString`的复杂对象。  
< ？  
> 比如，`dv.current().file.cday`，你显示一下。  
< 

```
dv.paragraph(dv.current().file.cday);
```

> 你觉得这个“September 21, 2021” （或者随便你实际看到的日期）是个什么类型？  
< 那根据上下文，反正不是字符串就是了。  
> 挺尖啊。这时候，首先的一个手段是，对于你拿不准的东西，可以在变量前面加一个`typeof` 关键字。

```
dv.paragraph(typeof dv.current().file.cday);
```

< 结果是`object`，这就是你说的是“实现了`toString`的复杂对象”咯。  
> 是的。你再跑一下这个试试。

```
dv.paragraph(typeof dv.current().file.cday.toString());
```

< 所以`file.cday`看上去像是个字符串，但是其实并不是。那它是个啥？  
> 这个问题不太好回答，但是很多时候，我们可以用更复杂的手段来查看一下这个对象都有哪些可以调用的方法或者属性，譬如`Object.getOwnPropertyNames()`：

```
dv.paragraph(Object.getOwnPropertyNames(dv.current().file.cday));
```

< 看到了一些奇怪的东西，还有个isLuxonDateTime的。  
> 如果你把`dv.current().file.cday.isLuxonDateTime`显示出来，它的值应该是`true`，而这也就是这个东西的实质了：dv内部的时间都用的是[Luxon](https://moment.github.io/luxon/#/)的DateTime对象。

< 所以每种复杂对象里面都会有一个标识自己的身份的属性吗？  
> 没有。  
< \[○･｀Д´･ ○\]  
> 此外的一种方法是输出某个变量的`.constructor.name`，但是对于上面的变量，这个只会输出`DateTime`，并不能彻底缩小搜索范围。  
< 无奈。  
> 所以经常你只能靠猜和搜索，但是知道怎么调查已经是非常有利的了。回到这个时间对象上，因为它看上去像是字符串，却并不是字符串，所以你如果写出类似`dv.current().file.cday == "September 21, 2021"`的表达式，那么它的结果可能会出乎你的预料，因为复杂对象和简单的字符串对比，结果几乎一定是不等的。  
< 防不胜防啊。  
> 所以，在开始的一阵子，需要反复查验，直到你逐渐熟悉各种东西的类型为止。  
< 没有什么统计列表可查吗？  
> 其实，[有](https://blacksmithgu.github.io/obsidian-dataview/query/expressions/)，但是并没有给出各种DVJS对象的详细内容。  
< 聊胜于无吧。  
> 还有就是时不时来看看[我个人的DVJS记录](https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings)了。

````