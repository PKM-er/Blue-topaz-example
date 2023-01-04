## Taskido: Obsidian-Tasks-Timeline

## [Click here!](https://github.com/702573N/Obsidian-Tasks-Timeline)

[![Semi_Transparent](https://user-images.githubusercontent.com/59178587/210307060-5ed916ee-819d-46b1-9a5e-efdd15728957.png)](https://user-images.githubusercontent.com/59178587/210307060-5ed916ee-819d-46b1-9a5e-efdd15728957.png)

___

## Obsidian-Tasks-Calendar

#### A custom view build with [Obsidian-Dataview](https://github.com/blacksmithgu/obsidian-dataview) to display tasks from [Obsidian-Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) and from your daily notes in a highly customisable calendar with a wide variety of views

[![light](https://user-images.githubusercontent.com/59178587/203789595-ede6138f-2c29-4148-b52f-874ab3ea43f7.png)](https://user-images.githubusercontent.com/59178587/203789595-ede6138f-2c29-4148-b52f-874ab3ea43f7.png)

## Story

All Obsidian and Task Plugin users love the program. What has been set up with the Task Plugin is just great and helps so many people to organize their work. However, just listing tasks according to certain criteria is sometimes a bit boring. To get a quick visual impression of one's workday/workweek/workmonth, a calendar view would be ideal. To be honest, I'm too stupid to program my own plugins for Obsidian, but I know some Javascript, so I programmed this Dataview snippet. I hope to offer many people a good addition to the Task Plugin and hope for an integration into the Task Plugin someday. But I'm sure there are better programmers out there, who can make my code, which is probably horrible for professionals, much better.

## Setup

1.  Install "Dataview Plugin" from the external plugins
2.  Create a new folder called "tasksCalendar" or any other name and paste the files "view.js" and "view.css" into it

[![Tree Demo](https://user-images.githubusercontent.com/59178587/203789303-4474847e-ab84-4f33-8665-c17ca887ec79.png)](https://user-images.githubusercontent.com/59178587/203789303-4474847e-ab84-4f33-8665-c17ca887ec79.png)

3.  Create a new note or edit an existing one and add the following code line:
    
    ````
    ```dataviewjs
    await dv.view("tasksCalendar", {pages: "", view: "month", firstDayOfWeek: "1", options: "style1"})
    ```
    ````
    
    If you paste the main files (js/css) into another folder then "tasksCalendar", you have to replace the name between the first quotation marks.
    
4.  There are 4 different variables to set path/location as "pages", calendar view style as "view", first day of the week (0 or 1) as "firstDayOfWeek" and some style classes as "options"
    

___

## Required parameters

### pages:

For help and instruction take a look here [Dataview Help](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvpagessource)

Get all tasks from all notes in obsidian.

```
pages: '"Task Management/Work"'
```

Set a custom folder to get tasks from.

The dv.pages command is the same and works exactly the same like in dataview-plugin.

```
pages: "dv.pages().file.tasks.where(t => t.tags.includes('#Pierre'))"
pages: "dv.pages().file.tasks.where(t=>!t.checked && t.header.subpath != 'Log')"
pages: "dv.pages().file.where(f=>f.tags.includes('#ToDo') || f.tags.includes('#Task')).where(f=>f.folder != 'Inbox').tasks"
```

It is also possible to define complex queries. These must start with `dv.pages` and output tasks as a result.

### view:

```
view: "list"
view: "month"
view: "week"
```

With the view parameter you can set the default calendar view.

### firstDayOfWeek:

```
firstDayOfWeek: "1"
firstDayOfWeek: "0"
```

Set monday (1) or sunday (0) as first day of week

### options:

You have multiple options to personalize your Tasks-Calendar. The absolutelely must have is to set a custom week view style (style1, style2, ...) as your default week view style. However, you can switch between the individual styles at any time in the calendar itself by clicking the week view button again if this view is active.

[![Style-switcher](https://user-images.githubusercontent.com/59178587/203786071-eb97d99d-507b-4a92-9812-ba5cf6fd66ad.png)](https://user-images.githubusercontent.com/59178587/203786071-eb97d99d-507b-4a92-9812-ba5cf6fd66ad.png)

But that's not all. With the options parameter you can hide things you don't need or like, get a mini version of the calendar and many more...

Hide the task icons in front of each task.

By default the Tasks-Calendar show up tasks with a start- and a due-date on all days between these two like a calendar app displays all-day events across all days from the first to the last day. If you don't like this, you can turn it off with the `noProcess` option.

Hide daily notes inside calendar

Some users do not use the Task plugin, but work mainly with daily notes. To enable these users to use the functionality of this calendar, all tasks from daily notes are displayed on the respective date of the daily note. As some task plugin users may also work with daily notes, some may find it annoying to see them in the calendar as well between all Task plugin stuff. With the option `noDailyNote` you can hide all tasks (without any Task plugin date syntax) from your calendar.

```
options: "noCellNameEvent"
```

By default you can click on each cell name to jump directly into the daily note. If no daily note with this date exist, a new one will be created. This is nice for hardcore daily note users, but for others it could be annoying. To prevent unintentional execution you can disable the cell name click-events with the option `noCellNameEvent`.

Reduces the calendar width, height and font sizes to a more compact format. This can be used to embed the calendar into a complex sidebar in Obsidian. On mobile devices, the font size is automatically reduced (on some views) because the limited screen size.

Hide the week number in front of each week-wrapper inside the month calendar. After deactivation, it is unfortunately no longer possible to jump directly to a desired week.

Hides the task header line with the note file name

```
options: "lineClamp1"
options: "lineClamp2"
options: "lineClamp3"
options: "noLineClamp"
```

Set a line clamp from 1-3 inside your displayed tasks. By default 1 line is set. Alternative you can disable line clamp and show full task description text.

The back layer of the grid with the month or week information can be hidden with this.

You can use this option to hide the overdue days flag on overdue tasks.

### Optional parameters

#### dailyNoteFolder:

```
dailyNoteFolder: "MyCustomFolder"
dailyNoteFolder: "Inbox/Daily Notes/Work"
```

This parameter must only be specified if this is to be used. Here you can define a custom folder path for the daily notes if they should not be saved in the default folder for new files. Of course, folder structures with several levels can also be defined here. This paramter

#### dailyNoteFormat:

```
dailyNoteFormat: "YYYY, MMMM DD - dddd"
dailyNoteFormat: "YYYY-[W]ww"
```

This parameter must only be specified if this is to be used. Without this parameter the default format "YYYY-MM-DD" is used to identify your daily notes. You can set a custom format with a limited base set of characters: Y M D \[W\] ww d . , - : (SPACE)

#### startPosition:

Month: 2022 - December

```
view: "month"
startPosition: "2022-12"
```

Week: 2022 - W50

```
view: "week"
startPosition: "2022-50"
```

This parameter is optional and can be used to set a custom month or week to give focus after load. The default format on month view is `YYYY-MM`and on week view `YYYY-ww`. The first 4 digits represents the year and the last 1-2 digits represents the month or the week. Both must be separated with a minus character.

#### globalTaskFilter:

```
globalTaskFilter: "#task"
```

This parameter must only be specified if this is to be used. Set a global task filter to hide from task text/description inside tasks-calendar.

#### css:

```
css: ".tasksCalendar.style4[view='week'] .grid { height: 300px !important }"
```

Now you can write custom css rules inside a css parameter. Please use the developer console to identify the elements classes! Each style string should start with .tasksCalendar to avoid css conflicts!

___

## Note colors and icon

In each note file you can define custom "color" and "icon" to show up in the calendar. To do so, you only need to add the following metadata to the first line of your note. By default the note-color is used for the dimmed background and as text-color. If you would like to give your tasks a completely different color then the note-color itself, then use the textColor meta.

```
---
color: "#bf5af2"
textColor: "#000000"
icon: "❤️"
---
```

The color should be hex in quotation marks to work properly. This color is set for text and as semi-transparent background. The icon itself is placed in front of the task filename header.

[![Note Color Demo](https://user-images.githubusercontent.com/59178587/203788233-555edbc4-915c-499c-bdf4-87c6030bfd55.png)](https://user-images.githubusercontent.com/59178587/203788233-555edbc4-915c-499c-bdf4-87c6030bfd55.png)

___

## Filter

On the upper left corner of each calendar-view is a filter-icon to show or hide all done and cancelled tasks. The default-filter is set by options. If you have `filter` inside your options parameter, the filter is enabled by default.

[![Filter Demo](https://user-images.githubusercontent.com/59178587/203787018-483bf485-3ce5-43b4-99ae-2a3a8efbf690.png)](https://user-images.githubusercontent.com/59178587/203787018-483bf485-3ce5-43b4-99ae-2a3a8efbf690.png)

___

## Statistic and focus

On the upper right corner is statistic button which opens a detailed list of all your tasks for the currently selected month/week. By selecting a task type you can focusing this tasks and dimm out all others. This way you can find the tasks you are looking for more easily.

Through a meaningful icon and a counter, you can quickly get an overview of incompleted tasks within the selected month/week without opening the pop-up window.

[![Focus Demo](https://user-images.githubusercontent.com/59178587/203786131-6ddf1389-8b66-4f3c-9d7a-121c5fe38540.png)](https://user-images.githubusercontent.com/59178587/203786131-6ddf1389-8b66-4f3c-9d7a-121c5fe38540.png)