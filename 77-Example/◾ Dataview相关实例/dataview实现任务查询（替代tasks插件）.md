---
---
<<<<<<< HEAD
=======


>>>>>>> 1f5fdd2ec646e9be43a6f0ccfc1903bb5c22a73a
[dataview task语法](https://blacksmithgu.github.io/obsidian-dataview/data-annotation/#field-shorthands)
## Dataview Tasks
### 语法
应付日期(due)：🗓️YYYY-MM-DD
完成日期(created)：✅YYYY-MM-DD
创建日期(completion)：➕YYYY-MM-DD

#### 示例
- [ ] 本周六之前完成🗓️2021-08-29
- [ ] 上周六完成任务 ✅2021-08-22.
- [ ] 打卡任务创建日期➕1990-06-14

如果不喜欢表情符号，仍然可以用文字注释这些字段
(`[due:: ]`, `[created:: ]`, `[completion:: ]`).

### 隐式字段
和页面一样，Dataview为每个任务添加了一些隐式字段。

任务继承了其父级页面的所有字段--所以如果你在你的页面上有一个rating 字段，你也可以在你的任务上访问它。
- completed:已完成。这个特定的任务是否已经完成；这并不考虑任何子任务的完成/不完成情况。
- fullyCompleted（完全完成）。这个任务和它的所有子任务是否已经完成。
- text: 任务的内容
- line（行）。该任务显示的行。
- path（路径）。该任务所在文件的完整路径。
- section（节）。该任务所包含的章节的链接。
- link（链接）。通向该任务附近最近的可链接块的链接；对于建立指向该任务的链接很有用。
- subtasks（子任务）。这个任务的任何子任务。
- real: 如果为真，这是一个真实的任务；否则，它是一个任务上方/下方的列表元素。
- completion（完成）。一个任务完成的日期。如果没有注释，将默认为文件修改时间。
- due: 任务到期的日期，如果设置的话。
- created：任务创建的日期。如果没有注释，默认为文件创建时间。
- annotated（注释）。如果任务有任何自定义注释，则为真，否则为假。
- tags 任务中的标签

