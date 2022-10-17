## 热力图


```dataviewjs
const pages =  dv.pages('"20-Diary"').where(p => p.a)
const ValueList = []
const DateList = []
pages.forEach((page)=>{
	DateList.push([page.file.name, page.a])
})
console.log(DateList)
const echarts = app.plugins.plugins['obsidian-echarts'].echarts()
const option = {
    legend: {
        data: [
            {
                name: '系列1',
                // 强制设置图形为圆。
                icon: 'circle',
                // 设置文本为红色
                textStyle: {
                    color: 'red',
                },
            },
        ],
    },
    title: {
        top: 30,
        left: 'center',
        text: '2022年热力图',
    },
    tooltip: {},
    visualMap: {
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        textStyle: {
            color: '#000',
        },
    },
    calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: '2022',
        itemStyle: {
            borderWidth: 0.5,
        },
        yearLabel: { show: false },
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: DateList,
    },
};
app.plugins.plugins['obsidian-echarts'].render(option, this.container)
```


