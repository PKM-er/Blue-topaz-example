 ## days
 ```dataviewjs
let nofold = '!"88-Template"'
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let total = parseInt([new Date() - ftMd.ctime] / (60*60*24*1000))
let allFile = dv.pages(nofold).file
dv.paragraph(`
>[!note|noicon] ## Ob天数 [[echarts-笔记动态显示-分布|${total}]]
>
`)
```
 ## notes
 ```dataviewjs
let nofold = '!"88-Template"'
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let allFile = dv.pages(nofold).file
dv.paragraph(`
>[!note|noicon] ## 文档 [${allFile.length}](obsidian://advanced-uri?commandid=obsidian-better-command-palette%253Aopen-better-commmand-palette-file-search)
>
`)
```

## tags
 ```dataviewjs
let nofold = '!"88-Template"'
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let allFile = dv.pages(nofold).file
dv.paragraph(`
>[!note|noicon] ## 标签 [[文件夹所有标签|${allFile.etags.distinct().length}]]
>
`)
```
## tasks
 ```dataviewjs
let nofold = '!"88-Template"'
let ftMd = dv.pages("").file.sort(t => t.cday)[0]
let allFile = dv.pages(nofold).file
dv.paragraph(`
>[!note|noicon] ## 事项 [[任务卡片-dataview 任务查询举例#所有未完成的任务|${allFile.tasks.length}]]
>
`)
```


## 笔记数量
```dataviewjs
const data = []
app.vault.root.children.forEach((child)=>{
	if(child.path.split(".")[1] != "md"){
	if(dv.pages(`"${child.path}"`).length > 0)
		data.push({name: child.path, value: dv.pages(`"${child.path}"`).length})
	}
})
let total = data.reduce((a, b) => {
    return a + b.value * 1;
}, 0);
     const options = {
         backgroundColor: 'transparent',
         width: '300px',
         height: '300px',
            title: {
             text: total,
                x: 'center',
                y: 'center',
                textStyle: {
                    fontSize: 20
                }
            },
            tooltip: {
                trigger: 'item'
            },
            color: [
                '#58b2ff', '#68d4b2', '#7380ff', '#fdd56a', '#fdb36a', '#fd866a', '#9e87ff'
            ],
            series: [{
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['40%', '65%'],
                clockwise: true,
                avoidLabelOverlap: true,
                hoverOffset: 15,
                itemStyle: {
                    normal: {

                    }
                },
                label: {
                    show: true,
                    position: 'outside',
                       formatter: (params) => {
                        return '{name|' + params.name + '}';
                    },
                     rich: {
                        name: {
                            fontSize: 10,
                            fontFamily: 'PingFang SC',
                            fontWeight: 400,
                            color: 'auto',
                            lineHeight:20,
                            align: 'left'
                        },
                        value: {
                            fontSize: 13,
                            fontFamily: 'Source Han Sans CN',
                            color: '#FFF',
                            fontWeight: 400,
                            lineHeight:16,
                            align: 'right'
                        },
                        }
                },
                labelLine: {
                    show:false,
                },
                data: data
            }]
        };
app.plugins.plugins['obsidian-echarts'].render(options, this.container)
```
## 分布
```dataviewjs
const echarts = app.plugins.plugins['obsidian-echarts'].echarts()
let pages= dv.pages()
           .groupBy(p => p.file.cday.toFormat("yyyy-MM"))
           .map(p => ({cday: p.key , count: p.rows.length,wordcout:p.rows.values}))
           .array();
  function sumItem(arr1, arr2) {
            if (arr2.length == 0) {
                return arr1;
            } else {
                arr1.map(function(value, index) {
                    arr2[index] += value;
                })
            }
            return arr2;
        }

const xData = []
const yData = []
const y2Data = [] 
pages.forEach((page)=>{
	xData.push(page.cday)
	yData.push(page.count)
	y2Data.push(page.wordcout)
})
 let wordscout=[]
 let num =0
	for (let i = 0; i < y2Data.length; i++) {
		for (let j = 0; j < y2Data[i].length; j++) {
				num+=Number(y2Data[i][j].file.size)	
		}
	wordscout[i]=parseInt((num/3)/8)
	}
const y3Data =sumItem(yData,wordscout)
console.log(y2Data)

// Generate data
var category = xData;
var dottedBase = [];               
var barData = y3Data;
            

var dottedBase = [];
var lineData = yData;              

// option
const options = {
    backgroundColor: 'transparent',
         height: '300px',
    title: {
        text: '',
        x: 'center',
        y: 0,
        textStyle:{
            color:'#B4B4B4',
            fontSize:16,
            fontWeight:'normal',
        },
        
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor:'rgba(255,255,255,0.8)',
        axisPointer: {
            type: 'shadow',
            label: {
                show: true,
                backgroundColor: '#7B7DDC'
            }
        }
    },
    legend: {
        data: ['笔记数量','笔记体积'],
        textStyle: {
            color: '#B4B4B4'
        },
        top:'3%',
    },
    grid:{
        // x:'12%',
        width:'55%',
        // y:'12%',
        left:"10%",
        // right:"30%",
        bottom:"60%"
        
    },
    xAxis: {
        data: category,
        axisLine: {
            lineStyle: {
                color: '#B4B4B4'
            }
        },
        axisTick:{
            show:false,
        },
    },
    yAxis: [{

        splitLine: {show: false},
        axisLine: {
            lineStyle: {
                color: '#B4B4B4',
            }
        },
        
        axisLabel:{
            formatter:'{value} ',
        }
    },
        {

        splitLine: {show: false},
        axisLine: {
            lineStyle: {
                color: '#B4B4B4',
            }
        },
        axisLabel:{
            formatter:'{value} ',
        }
    }],
    
    series: [{
        name: '笔记数量',
        type: 'line',
        smooth: true,
        showAllSymbol: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        yAxisIndex: 1,
        itemStyle: {
                normal: {
                color:'#F02FC2'},
        },
        data: lineData
    }, 
    {
        name: '笔记体积',
        type: 'bar',
        barWidth: 10,
        itemStyle: {
            normal: {
                barBorderRadius: 5,
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        {offset: 0, color: '#956FD4'},
                        {offset: 1, color: '#3EACE5'}
                    ]
                )
            }
        },
        data: barData
    }
   ]
};

app.plugins.plugins['obsidian-echarts'].render(options, this.container)

```
