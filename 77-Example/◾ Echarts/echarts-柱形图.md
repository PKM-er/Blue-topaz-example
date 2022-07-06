---
---
# 标签柱形图
```dataviewjs
const pages = dv.pages("#Movie").filter((page) => {return page.rating && typeof(page.rating) == "number"})
const ratingList = []
const fileList = []
pages.forEach((page)=>{
	fileList.push(page.name)
	ratingList.push(page.rating)
})
const option = {
	width: 600,
	height: 400,
	grid: {
	  bottom: 200,
	},
	title: {
          text: '电影评分'
        },
	tooltip: {},
	legend: {
	  data: ['评分']
	},
	xAxis: {
	  type: 'category',
      name: '电影',
	  axisTick:{length: 0.1},
	  axisLabel: {rotate: 30,interval: 0, textStyle: {fontSize: "12"}, height: 100},
	  data: fileList
	},
	yAxis: {name: "评分"},
	series: [{
		type: "bar",
		name: "评分",
		data: ratingList
	}]
}
app.plugins.plugins['obsidian-echarts'].render(option, this.container)
```






```dataviewjs
const pages =  dv.pages()
           .groupBy(p => p.file.folder)
           .sort(p=> p.rows.length)
           .map(p => ({folder: p.key || "根目录", count: p.rows.length}))
           .array();
const valueList = []
const fileList = []
pages.forEach((page)=>{
	fileList.push(page.folder)
	valueList.push(page.count)
})
const option = {

	grid: {
	left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true
	},
	title: {
          text: '文件夹文件数量分布'
        },
	tooltip: {},
	legend: {
	  data: ['数量']
	},
	yAxis: {
	  type: 'category',
      name: '文件夹',
	  axisTick:{length: 0.1},
	  axisLabel: {rotate: 30,interval: 0, textStyle: {fontSize: "12"}, height: 100},
	  data: fileList
	},
	xAxis: {name: "数量"},
	series: [{
		type: "bar",
		name: "评分",
		data: valueList
	}]
}
app.plugins.plugins['obsidian-echarts'].render(option, this.container)

```

```dataviewjs
const pages =  dv.pages()
           .groupBy(p => p.file.folder)
           .sort(p=> p.rows.length)
           .map(p => ({name: p.key || "根目录", value: p.rows.length}))
           .array().reverse();
let itemStyle
const colorList = ['#f36c6c', '#e6cf4e', '#20d180', '#0093ff'];
const datas = pages
const option = {

	title: {
          text: '文件夹文件数量分布'
        },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        show: false
    },
    grid: {
        left: '0%',
	    right: '4%',
        bottom: '20%',
        containLabel:true
    },
    xAxis: {
        show: false,
        type: 'value'

    },
    yAxis: [{
        type: 'category',
        inverse: true,
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        axisPointer: {
            label: {
                show: true,
                margin: 30
            }
        },
        data: datas.map(item => item.name),
        axisLabel: {
	       rotate: 30,
	       interval: 0, 
	       textStyle: {fontSize: "12"}
        }
    }, {
        type: 'category',
        inverse: true,
        axisTick: 'none',
        axisLine: 'none',
        show: true,
        data: datas.map(item => item.value),
        axisLabel: {
             show:true,
             fontSize: 14,
             color: '#333',
             formatter:''
         }
    }],
    series: [{
            z: 2,
            name: 'value',
            type: 'bar',
            barWidth: 20,
            zlevel: 1,
            data: datas.map((item, i) => {
            itemStyle = {
                color: i > 3 ? colorList[3] : colorList[i]
                }
            return {
            value: item.value,
            itemStyle: itemStyle
                };
            }),
            label: {
                show: true,
                position: 'right',
                fontSize: 12,
                offset: [5, 0]
            }
        },
        {
            name: '背景',
            type: 'bar',
            barWidth: 20,
            barGap: '-100%',
            itemStyle: {
                normal: {
                    color: 'rgba(118, 111, 111, 0)'
                }
            },
            
        }

    ]
};

app.plugins.plugins['obsidian-echarts'].render(option, this.container)

````







