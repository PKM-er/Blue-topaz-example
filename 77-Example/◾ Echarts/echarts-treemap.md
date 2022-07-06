---
---
### 文件夹文件数量矩阵图
```dataviewjs

const pages =  dv.pages()
           .groupBy(p => p.file.folder)
           .sort(p=> p.rows.length)
           .map(p => ({name: p.key || "根目录", value: p.rows.length}))
           .array().reverse();
const colorList = ['#f36c6c', '#e6cf4e', '#20d180', '#0093ff'];
const datas = pages

const option = {
	title: {
          text: '文件夹文件数量矩阵图'
        },
    series: {
        type: 'treemap',
        itemStyle: {
            color: 'rgba(109, 40, 40, 1)',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 0, 0)',
        },
        data: pages
        
    },
    type: 'basicTreemap',
};

app.plugins.plugins['obsidian-echarts'].render(option, this.container)
```
![[echarts-扇形图#笔记数量]]