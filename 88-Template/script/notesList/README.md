# Obsidian-Notes-List
Dataview Snippet To Show Notes In Different List Views

## Story
All Obsidian users switched from some other note-taking programme (such as Evernote, Apple Notes, Standard Notes, Bear Notes) to Obsidian. When switching, many users lack a list of all notes with a small excerpt of the text and, if applicable, a thumbnail image. This Dataview snippet makes it possible to retrofit this missing view with a single line of code. All that is needed is the Dataview plugin.

## Setup
1.  Install "Dataview Plugin" from the external plugins
2.  Create a new folder called "notesList" or any other name and paste the files "view.js" and "view.css" into it

    <img width="205" alt="Bildschirm­foto 2022-10-16 um 14 25 00" src="https://user-images.githubusercontent.com/59178587/196035303-72d032a9-09b2-4c98-9afa-c2b835a2b107.png">

3.  Create a new note or edit an existing one and add the following code line:

    ````
    ```dataviewjs
    dv.view("notesList", {pages: "", view: "normal"})
    ```
    ````
    
    If you paste the main files (js/css) into another folder then "notesList", you have to replace the name between the first quotation marks.
 
 4. There are 2 different variables to set path/location as "pages", list view style as "view".

---
### pages:
```
pages: ""
```
Get all notes in obsidian.

```
pages: "Notes/Theology"
```
Set a custom folder to get notes from.
    
---
### view:
```
view: "normal"
```
List view with small text preview and a preview of all attachments below like in Bear.

```
view: "compact"
```
List view with small text preview and a preview of the first attachment inside the note.

```
view: "cards"
```
List view with small cards of each note including small text preview and a preview of the first attachment inside the note.
    
---

## Impressions

### Normal View
<img width="711" alt="Bildschirm­foto 2022-10-16 um 14 16 45" src="https://user-images.githubusercontent.com/59178587/196035529-cc727ad6-36e4-4085-a6b9-65dd2091f3f9.png">

---

### Compact View
<img width="703" alt="Bildschirm­foto 2022-10-16 um 14 17 41" src="https://user-images.githubusercontent.com/59178587/196035534-8da3fd4e-646f-4f75-a8d4-544f44147aea.png">

---

### Cards View
<img width="672" alt="Bildschirm­foto 2022-10-16 um 14 18 18" src="https://user-images.githubusercontent.com/59178587/196035541-e28b89fe-3cd7-4f80-a3dd-6b258082710d.png">
