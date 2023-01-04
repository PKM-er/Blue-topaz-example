# Taskido: Obsidian-Tasks-Timeline
#### A custom view build with [Obsidian-Dataview](https://github.com/blacksmithgu/obsidian-dataview) to display tasks from [Obsidian-Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks) and from your daily notes in a highly customisable timeline

<p align="center"><img width="400" alt="Semi_Transparent" src="https://user-images.githubusercontent.com/59178587/210307060-5ed916ee-819d-46b1-9a5e-efdd15728957.png"></p>

- All your tasks in a clean and simple timeline view
- Pin all your important notes directly into your timeline
- Focus today, to do, overdue or processing tasks
- Quick add new tasks to your daily note
- Custom colors for all your tags and notes

---

## Setup
1.  Install "Dataview Plugin" from the external plugins
2.  Create a new folder called "Taskido" or any other name and paste the files "view.js" and "view.css" into it
3.  Create a new note or edit an existing one and add the following code line:

    ````
    ```dataviewjs
    await dv.view("taskido", {pages: ""})
    ```
    ````
    
    If you paste the main files (js/css) into another folder then "Taskido", you have to replace the name between the first quotation marks.
 
 4. There are more parameters to customize the look and feel of Taskido but there aren't necessary.

---

## Required parameter

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
pages: "dv.pages().file.tasks.where(t=>!t.checked && t.header.subpath != 'Log')"
pages: "dv.pages().file.where(f=>f.tags.includes('#ToDo') || f.tags.includes('#Task')).where(f=>f.folder != 'Inbox').tasks"
```
It is also possible to define complex queries. These must start with `dv.pages` and output tasks as a result.

---

## Optional parameters

### options:
```
options: "noMotivation"
options: "noRepeat"
options: "noPriority"
options: "noTag"
options: "noAdd"
options: "noRelative"
```
With this options you can hide some elements which they do not need, or which disturb, like motivation texts, recurrence rules, priority information, tags, relative dates or the add task to daily note button on today.

```
options: "todayFocus"
options: "todoFocus"
options: "overdueFocus"
options: "processFocus"
```
With this options you can set a default focus after open the timeline.

### dailyNoteFolder:
```
dailyNoteFolder: "MyCustomFolder"
dailyNoteFolder: "Inbox/Daily Notes/Work"
```
Here you can set a custom folder path for the daily notes if they should not be saved in the default folder for new files. Of course, folder structures with several levels can also be defined here.

### dailyNoteFormat:
```
dailyNoteFormat: "YYYY, MMMM DD - dddd"
dailyNoteFormat: "YYYY-[W]ww"
```
You can set a custom format with a limited base set of characters: Y M D [W] ww d . , - : (SPACE). Without this parameter the default format "YYYY-MM-DD" is used to identify your daily notes.

### globalTaskFilter:
```
globalTaskFilter: "#task"
```
Set a global task filter to hide from task text/description inside tasks-calendar.

### starred:
```
starred: false
```
By default your starred notes are pinned to the timeline based on the creation date of files. This can be disabled by entering this parameter. This function allows you to keep an eye on your most important notes without having to leave the timeline. It is also possible to remove stars by right-clicking in the timeline. Please consider the update rate of the Dataview plugin, which can lead to a delay here.

<img width="359" alt="Bildschirm­foto 2023-01-02 um 12 14 04" src="https://user-images.githubusercontent.com/59178587/210223951-8bf33632-1699-4771-8f9d-fe54245262f3.png">

### done:
```
done: true
```
By default all completed tasks are ignored except the today ones. By entering this paramter, you get a long list with absolutely all tasks. However, this is not recommended.

### sort:
```
sort: "t.text"
sort: "t.completed"
sort: "t.priority"
```
With the sort paramter you can set your personal sort algorithm to sort your tasks inside a day.

---

## Note colors
In each note file you can set a custom "color" to show up in the calendar. You only need to add the following metadata to the first line of your note.

<img width="570" alt="Bildschirm­foto 2023-01-02 um 12 17 47" src="https://user-images.githubusercontent.com/59178587/210224314-5a54180f-1c63-490c-8c37-aaff7bb4d707.png">
    
The color should be hex in quotation marks to work properly.

<img width="362" alt="Bildschirm­foto 2023-01-02 um 12 16 25" src="https://user-images.githubusercontent.com/59178587/210224367-31ddc0d2-0ec5-497f-ae22-5ab2be508571.png">

---

## Tag colors
You can set a custom color for all your tags displayed inside Taskido. Here I'm using the nesting tag feature to implement this. The first tag (root-node) is used as hex-color and the second tag after the slash is your main tag:

    `#0a84ff/demo`

If Taskido can identify the first tag as a hex-color, your tag get this as custom var(--tag-color) and var(--tag-background). The hex-color isn't visible on the displayed tag itself because it will be replaced.

The tag-autocomplete functionality inside Obsidian makes it possible to quickly find and re-use an existing tag without typing the hex-color first. This is realy cool and I hope the Obsidian founders will implement this in future.

<img width="183" alt="Bildschirm­foto 2023-01-02 um 11 50 05" src="https://user-images.githubusercontent.com/59178587/210222128-f892d87a-7a2b-4553-a8a6-b5d3d4dd3b51.png">

---

## Focussing
A small separation give focus on today. Three info boxes (To Do, Overdue, Process) give you all necessary informations to do your best on today. By clicking on each box, your selected tasks get a highlight to keep focus on. By clicking on the "Today" header you can also hide all other days from timeline.

<img width="358" alt="Bildschirm­foto 2023-01-02 um 12 04 05" src="https://user-images.githubusercontent.com/59178587/210223039-094b6586-fdb4-4628-b9f7-863034ec2b33.png">
