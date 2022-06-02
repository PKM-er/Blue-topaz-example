# 扇形图
```dataviewjs
const data = []
app.vault.root.children.forEach((child)=>{
	if(child.path.split(".")[1] != "md"){
		//console.log(child.path)
		data.push({name: child.path, value: dv.pages(`"${child.path}"`).length})
	}
})

const options = {
  backgroundColor: 'transparent',
  title: {
    text: '根文件夹包含笔记数量',
    left: 'center',
    top: 20,
    textStyle: {
      color: '#ccc'
    }
  },
  tooltip: {
    trigger: 'item'
  },
  visualMap: {
    show: false,
    min: 0,
    max: 50,
    inRange: {
      colorLightness: [1, 0]
    }
  },
  series: [
    {
      name: '笔记数量',
      type: 'pie',
      radius: '75%',
      center: ['50%', '50%'],
      data: data.sort(function (a, b) {
        return a.value - b.value;
      }),
      roseType: 'radius',
      label: {
	        color: 'rgba(255, 255, 255, 0.3)'
      },
      labelLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.3)'
        },
        smooth: 0.2,
        length: 10,
        length2: 20
      },
      itemStyle: {
        color: '#c23531',
        shadowBlur: 200,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200;
      }
    }
  ]
};
app.plugins.plugins['obsidian-echarts'].render(options, this.container)
```
## 笔记数量
```dataviewjs
const data = []
app.vault.root.children.forEach((child)=>{
	if(child.path.split(".")[1] != "md"){
		//console.log(child.path)
		data.push({name: child.path, value: dv.pages(`"${child.path}"`).length})
	}
})

const options = {
    backgroundColor: '#fff',
    title: {
        text: '笔记数量',
        subtext: '2022',
        x: 'center',
        y: 'center',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 16
        }
    },
    tooltip: {
        show: true,
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'horizontal',
        bottom: '0%',
        data: ['<10w', '10w-50w', '50w-100w', '100w-500w', '>500w']
    },
    series: [{
        type: 'pie',
        selectedMode: 'single',
        radius: ['25%', '58%'],
        color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67'],

        label: {
            normal: {
                position: 'inner',
                formatter: '{d}%',

                textStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 14
                }
            }
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data: data
    }, {
        type: 'pie',
        radius: ['58%', '83%'],
        itemStyle: {
            normal: {
                color: '#F2F2F2'
            },
            emphasis: {
                color: '#ADADAD'
            }
        },
        label: {
            normal: {
                position: 'inner',
                formatter: '{c}个',
                textStyle: {
                    color: '#777777',
                    fontWeight: 'bold',
                    fontSize: 14
                }
            }
        },
        data: data
    }]
};
app.plugins.plugins['obsidian-echarts'].render(options, this.container)
```