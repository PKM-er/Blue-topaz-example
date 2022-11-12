# Obsidian-Tasks-Calendar
#### A custom view build with [Obsidian-Dataview](https://github.com/blacksmithgu/obsidian-dataview) to display tasks from [Obsidian-Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) and from your daily notes in a highly customisable calendar with a wide variety of views

![Mockup](https://user-images.githubusercontent.com/59178587/200115332-382ecaed-845a-479b-a363-fa9c136b3342.png)

## Story
All Obsidian and Task Plugin users love the program. What has been set up with the Task Plugin is just great and helps so many people to organize their work. However, just listing tasks according to certain criteria is sometimes a bit boring. To get a quick visual impression of one's workday/workweek/workmonth, a calendar view would be ideal. To be honest, I'm too stupid to program my own plugins for Obsidian, but I know some Javascript, so I programmed this Dataview snippet. I hope to offer many people a good addition to the Task Plugin and hope for an integration into the Task Plugin someday. But I'm sure there are better programmers out there, who can make my code, which is probably horrible for professionals, much better.

## Setup
1.  Install "Dataview Plugin" from the external plugins
2.  Create a new folder called "tasksCalendar" or any other name and paste the files "view.js" and "view.css" into it

    <img width="259" alt="Bildschirm­foto 2022-10-30 um 10 00 03" src="https://user-images.githubusercontent.com/59178587/198870629-392cb4fe-654a-421c-b8fb-d4b66def329b.png">

3.  Create a new note or edit an existing one and add the following code line:

    ````
    ```dataviewjs
    await dv.view("tasksCalendar", {pages: "", view: "month", firstDayOfWeek: 1, options: "style1"})
    ```
    ````
    
    If you paste the main files (js/css) into another folder then "tasksCalendar", you have to replace the name between the first quotation marks.
 
 4. There are 4 different variables to set path/location as "pages", calendar view style as "view", first day of the week (0 or 1) as "firstDayOfWeek" and some style classes as "options"

---
## Required parameters

### pages:

For help and instruction take a look here [Dataview Help](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvpagessource)

```
pages: ""
```
Get all tasks from all notes in obsidian.

```
pages: '"Task Management/Work"'
```
Set a custom folder to get tasks from.

The dv.pages command is the same and works exactly the same like in dataview-plugin.

```
pages: "dv.pages().file.tasks.where(t => t.tags.includes('#Pierre'))"
```
It is also possible to define complex DQL (Dataview Query Language) queries. These must start with `dv.pages` and output tasks as a result.
    

### view:
```
view: "month"
view: "week"
```
With the view parameter you can set the default selected calendar
  

### firstDayOfWeek:
```
firstDayOfWeek: 1
firstDayOfWeek: 0
```
Set monday (1) or sunday (0) as first day of week

---
## Optional parameters

### dailyNoteFolder:
```
dailyNoteFolder: ""
dailyNoteFolder: "MyCustomFolder"
dailyNoteFolder: "Inbox/Daily Notes/Work"
```
This parameter must only be specified if this is to be used. Here you can define a custom folder path for the daily notes if they should not be saved in the default folder for new files. Of course, folder structures with several levels can also be defined here. This paramter 

### startPosition:
```
startPosition: ""
startPosition: "2024-06-01"
```
This parameter can be used to set a date to give focus an month or week view (set with `view:` parameter). On month calendar every date between the first and the last day of the month will be shown the right month. On the week calendar all dates between the first day and the last day of that week will be shown the right week. The input format must look like this `YYYY-MM-DD`.

### globalTaskFilter:
```
globalTaskFilter: ""
globalTaskFilter: "#task"
```
This parameter must only be specified if this is to be used. Set a global task filter to hide from task text/description inside tasks-calendar.

---
## Options parameter

```
options: "noIcons"
```
Hide Task plugin Icons in front of each task

```
options: "noProcess"
```
The tasks with a start-date and a due-date are not displayed on all days between them

```
options: "noDailyNote"
```
Hide daily notes inside calendar

```
options: "noCellNameEvent"
```
Disable pointer events on cell names to prevent unintentional execution

```
options: "mini"
```
Set smaller text on tasks, cell names and grid heads. Reduces the calendar width and height to a more compact format.
On mobile devices, the font size is automatically reduced because the limited screen size.

```
options: "noWeekNr"
```
Hide the week number in front of each wrapper/row/week inside the month calendar

```
options: "noTransparency"
```
Disable transparency of tasks backgrounds

```
options: "noBackground"
```
Disable background color of tasks. The task text remains coloured if a colour has been stored in the note

```
options: "lineClamp1"
options: "lineClamp2"
options: "lineClamp3"
```
Set a line clamp from 1-3 inside your displayed tasks. By default 1 line is set.

```
options: "noLayer"
```
The back layer of the grid with the month or week information can be hidden with this.

```
options: "noCounter"
```
Hides the counter line below the calendar.

---

### Style options

```
options: "style1"
```
There are different style options (style1, style2, ...) to change the look of the weekly calendar view

<img width="276" alt="1-3" src="https://user-images.githubusercontent.com/59178587/200121233-245a80ed-3f3d-477a-9dd3-ffce28df65a2.png">
<img width="265" alt="4-6" src="https://user-images.githubusercontent.com/59178587/200121237-36fc6588-cc8a-4d25-8c82-c7561a80cce4.png">
<img width="277" alt="7-9" src="https://user-images.githubusercontent.com/59178587/200121241-9f6cebbd-7970-461b-9543-839c8cef0833.png">
<img width="273" alt="10" src="https://user-images.githubusercontent.com/59178587/200121242-7ba4d615-7623-43fe-b161-22bfff8248ba.png">


---

## Note color & icon
In each note file you can define custom "color" and "icon" to show up in the calendar. To do so, you only need to add the following metadata to the first line of your note.

```
---
color: "#bf5af2"
icon: "❤️"
---
```
    
The color should be hex in quotation marks to work properly. This color is set for text and as semi-transparent background. The icon itself is placed in front of each task to help identify where this task comes from.

---

## Filter
On the upper right corner of each calendar-view is a filter-icon to show or hide all completed/done tasks. The default-filter is set by options. If you have `noDone` inside your options parameter, the filter is enabled by default.

---

## How It Works
This snippet fetch all tasks with a date like due, start, scheduled, done. Tasks with a start and a due date are presented on all days from start to end (due). This way you can show up periods on you calendar like a holiday. This default handling can be disabled in `options` inside the dataviewjs code line by adding `noProcess`.

<img width="1115" alt="Bildschirm­foto 2022-10-30 um 10 23 43" src="https://user-images.githubusercontent.com/59178587/198871481-bd9d4b89-ff99-435c-8c30-625f27f1a4f7.png">

Hovering a task let popup a small info about the note and task (note-title: task-description). In the upper left corner is the calendar switcher, which can be used to switch between two different calendar views (month/week). Under `view` in the dataviewjs code line the default calendar view is set. When switching between the views, the calendar remains in the previous month. By clicking on the calendar header, you can return to today (the current month or week) at any time. The arrow keys in the upper right corner can be used to scroll backwards and forwards through the months/weeks. The filter in the upper right corner allows you to hide all finished tasks in the calendar. The filter itself can be switched on by default with `noDone` in the `options` within the dataviewjs code line.

<img width="1116" alt="Bildschirm­foto 2022-10-30 um 10 19 22" src="https://user-images.githubusercontent.com/59178587/198871327-7eb684f4-04ee-4155-83be-7016889b2fee.png">

After a task is completed the start- and scheduled dates are no longer needed and will be hidden. The task is now only displayed on the final completion date.
