let {pages, globalTaskFilter, dailyNoteFolder, dailyNoteFormat, done, sort, starred, options} = input;

// Error Handling
if (!pages && pages!="") { dv.span('> [!ERROR] Missing pages parameter\n> \n> Please set the pages parameter like\n> \n> `pages: ""`'); return false };
if (dailyNoteFormat) { if (dailyNoteFormat.match(/[|\\YMDWwd.,-: \[\]]/g).length != dailyNoteFormat.length) { dv.span('> [!ERROR] The `dailyNoteFormat` contains invalid characters'); return false }};

// Get, Set, Eval Pages
if (pages=="") { var tasks = dv.pages().file.tasks } else { if (pages.startsWith("dv.pages")) { var tasks = eval(pages) } else { var tasks = dv.pages(pages).file.tasks } };
if (!options) {options = ""};
if (!dailyNoteFolder) {dailyNoteFolder = ""} else {dailyNoteFolder = dailyNoteFolder+"/"};
if (!dailyNoteFormat) {dailyNoteFormat = "YYYY-MM-DD"};
if (!sort) {sort = "!t.completed && Object.keys(t.happens).find(key => t.happens[key] === timelineDates[i].toString())"};

// Variables
var timelineDates = [];
var timelineNotes = dv.pages().file.filter(f=>f.starred == true && timelineDates.push(moment(f.cday.toString()).format("YYYY-MM-DD")) );
var tid = (new Date()).getTime();
var today = moment().format("YYYY-MM-DD");
var dailyNoteRegEx = momentToRegex(dailyNoteFormat)

// Set Root
const rootNode = dv.el("div", "", {cls: "taskido "+options, attr: {id: "taskido"+tid}});

// Icons
// var doneIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
var doneIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>';
var dueIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>';
var scheduledIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>';
var startIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>';
var overdueIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
// var processIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"></path><path d="M5 2h14"></path><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path></svg>';
var processIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path><path d="M12 13v9"></path><path d="M12 2v4"></path></svg>';
var dailynoteIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
// var dailytaskIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
var dailytaskIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
// var addIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
var addIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>';
var tagIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>';
var repeatIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="m7 22-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>';
var priorityIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
var starIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';

// Initialze
getMeta(tasks);
getTimeline(tasks);
setEvents();

function getMeta(tasks) {
	for (i=0;i<tasks.length;i++) {
		let happens = {};
		var taskText = tasks[i].text;
		var taskFile = getFilename(tasks[i].path);
		var dailyNoteMatch = taskFile.match(eval(dailyNoteRegEx));
		var dailyTaskMatch = taskText.match(/(\d{4}\-\d{2}\-\d{2})/);
		if (dailyNoteMatch && tasks[i].completed == false) {
			if(!dailyTaskMatch) {
				tasks[i].dailytask = moment(dailyNoteMatch[1], dailyNoteFormat).format("YYYY-MM-DD");
				happens["dailytask"] = moment(dailyNoteMatch[1], dailyNoteFormat).format("YYYY-MM-DD");
				timelineDates.push(moment(dailyNoteMatch[1], dailyNoteFormat).format("YYYY-MM-DD"));
			};
		};
		var dueMatch = taskText.match(/\📅\W(\d{4}\-\d{2}\-\d{2})/);
		if (dueMatch && tasks[i].completed == false) {
			tasks[i].text = tasks[i].text.replace(dueMatch[0], "");
			timelineDates.push(dueMatch[1]);
			if ( dueMatch[1] < moment().format("YYYY-MM-DD") ) {
				happens["overdue"] = dueMatch[1];
			} else {
				happens["due"] = dueMatch[1];
			};
		} else if (dueMatch && tasks[i].completed == true) {
			tasks[i].text = tasks[i].text.replace(dueMatch[0], "");
		};
		var startMatch = taskText.match(/\🛫\W(\d{4}\-\d{2}\-\d{2})/);
		if (startMatch && tasks[i].completed == false) {
			tasks[i].text = tasks[i].text.replace(startMatch[0], "");
			if ( startMatch[1] < moment().format("YYYY-MM-DD") ) {
				happens["process"] = moment().format("YYYY-MM-DD");
			} else {
				happens["start"] = startMatch[1];
				timelineDates.push(startMatch[1]);
			};
		} else if (startMatch && tasks[i].completed == true) {
			tasks[i].text = tasks[i].text.replace(startMatch[0], "");
		};
		var scheduledMatch = taskText.match(/\⏳\W(\d{4}\-\d{2}\-\d{2})/);
		if (scheduledMatch && tasks[i].completed == false) {
			tasks[i].text = tasks[i].text.replace(scheduledMatch[0], "");
			if ( scheduledMatch[1] < moment().format("YYYY-MM-DD") ) {
				happens["process"] = moment().format("YYYY-MM-DD");
			} else {
				happens["scheduled"] = scheduledMatch[1];
				timelineDates.push(scheduledMatch[1]);
			};
		} else if (scheduledMatch && tasks[i].completed == true) {
			tasks[i].text = tasks[i].text.replace(scheduledMatch[0], "");
		};
		var doneMatch = taskText.match(/\✅\W(\d{4}\-\d{2}\-\d{2})/);
		if (doneMatch && tasks[i].completed == true) {
			tasks[i].text = tasks[i].text.replace(doneMatch[0], "");
			if (done == true || doneMatch[1] == moment().format("YYYY-MM-DD")) {
				timelineDates.push(doneMatch[1]);
				happens["done"] = doneMatch[1];
			};
		};
		var repeatMatch = taskText.includes("🔁");
		if (repeatMatch) {
			tasks[i].repeat = tasks[i].text.substring(taskText.indexOf("🔁"), tasks[i].text.length);
			tasks[i].text = tasks[i].text.substring(0, taskText.indexOf("🔁"))
		};
		var lowMatch = taskText.includes("🔽");
		if (lowMatch) {
			tasks[i].text = tasks[i].text.replace("🔽","");
			tasks[i].priority = "D";
			tasks[i].priorityLabel = "low priority";
		};
		var mediumMatch = taskText.includes("🔼");
		if (mediumMatch) {
			tasks[i].text = tasks[i].text.replace("🔼","");
			tasks[i].priority = "B";
			tasks[i].priorityLabel = "medium priority";
		};
		var highMatch = taskText.includes("⏫");
		if (highMatch) {
			tasks[i].text = tasks[i].text.replace("⏫","");
			tasks[i].priority = "A";
			tasks[i].priorityLabel = "high priority";
		};
		if (!lowMatch && !mediumMatch && !highMatch) {
			tasks[i].priority = "C";
		}
		if (globalTaskFilter) {
			tasks[i].text = tasks[i].text.replaceAll(globalTaskFilter,"");
		} else {
			tasks[i].text = tasks[i].text.replaceAll("#task","");
		};
		tasks[i].text = tasks[i].text.replaceAll("[[","");
		tasks[i].text = tasks[i].text.replaceAll("]]","");
		tasks[i].text = tasks[i].text.replace(/\[.*?\]/gm,"");
		tasks[i].happens = happens;
	};
	timelineDates.push(today);
	timelineDates = [...new Set(timelineDates)].sort();
};

function setEvents() {
	rootNode.querySelectorAll('.counter').forEach(cnt => cnt.addEventListener('click', (() => {
		var activeFocus = Array.from(rootNode.classList).filter(c=>c.endsWith("Focus") && !c.startsWith("today"));
		if (activeFocus == cnt.id+"Focus") {
			rootNode.classList.remove(activeFocus);
			return false;
		};
		rootNode.classList.remove.apply(rootNode.classList, Array.from(rootNode.classList).filter(c=>c.endsWith("Focus") && !c.startsWith("today")));
		rootNode.classList.add(cnt.id+"Focus");
	})));
	rootNode.querySelector('.todayHeader').addEventListener('click', (() => {
		rootNode.classList.toggle("todayFocus");
	}));
};

function getFilename(path) {
	var filename = path.match(/^(?:.*\/)?([^\/]+?|)(?=(?:\.[^\/.]*)?$)/)[1];
	return filename;
};

function getMetaFromNote(task, metaName) {
	var meta = dv.pages('"'+task.link.path+'"')[metaName][0];
	if (meta) { return meta } else { return "" };
};

function momentToRegex(momentFormat) {
	momentFormat = momentFormat.replaceAll(".", "\\.");
	momentFormat = momentFormat.replaceAll(",", "\\,");
	momentFormat = momentFormat.replaceAll("-", "\\-");
	momentFormat = momentFormat.replaceAll(":", "\\:");
	momentFormat = momentFormat.replaceAll(" ", "\\s");
	
	momentFormat = momentFormat.replace("dddd", "\\w{1,}");
	momentFormat = momentFormat.replace("ddd", "\\w{1,3}");
	momentFormat = momentFormat.replace("dd", "\\w{2}");
	momentFormat = momentFormat.replace("d", "\\d{1}");
	
	momentFormat = momentFormat.replace("YYYY", "\\d{4}");
	momentFormat = momentFormat.replace("YY", "\\d{2}");
	
	momentFormat = momentFormat.replace("MMMM", "\\w{1,}");
	momentFormat = momentFormat.replace("MMM", "\\w{3}");
	momentFormat = momentFormat.replace("MM", "\\d{2}");
	
	momentFormat = momentFormat.replace("DDDD", "\\d{3}");
	momentFormat = momentFormat.replace("DDD", "\\d{1,3}");
	momentFormat = momentFormat.replace("DD", "\\d{2}");
	momentFormat = momentFormat.replace("D", "\\d{1,2}");
	
	momentFormat = momentFormat.replace("ww", "\\d{1,2}");
	
	regEx = "/^(" + momentFormat + ")$/";

	return regEx;
};

function getTimeline(tasks) {
	var lastYear = null;
	
	for (i=0; i<timelineDates.length; i++) {
		
		// Variables
		var notesFiltered = timelineNotes.filter(n=>moment(n.cday.toString()).format("YYYY-MM-DD") == timelineDates[i]);
		var tasksFiltered = tasks.filter(t=>Object.values(t.happens).includes(timelineDates[i].toString())).sort(t=> eval(sort));
		var relative = moment(timelineDates[i].toString()).fromNow();
		var date = moment(timelineDates[i].toString()).format("MM-DD ddd")
		var year = moment(timelineDates[i].toString()).format("YYYY");
		var detailsCls = "";
		var content = "";
		
		// Add Year Section
		if (year != lastYear) {
			lastYear = year;
			cls = moment().format("YYYY") == year ? "current" : "";
			rootNode.querySelector("span").appendChild(dv.el("div", year, {cls: "year " + cls}));
		};
		
		// Add Today Information
		if (timelineDates[i] == today) {
			detailsCls += "today";
			
			var overdueCount = tasks.filter(t=>t.happens["overdue"]).length;
			var dueCount = tasksFiltered.filter(t=>t.happens["due"]).length;
			var startCount = tasksFiltered.filter(t=>t.happens["start"]).length;
			var scheduledCount = tasksFiltered.filter(t=>t.happens["scheduled"]).length;
			var doneCount = tasksFiltered.filter(t=>t.happens["done"]).length;
			var dailynoteCount = tasksFiltered.filter(t=>t.happens["dailynote"]).length;
			var processCount = tasksFiltered.filter(t=>t.happens["process"]).length;
			var todoCount = tasksFiltered.filter(t=>!t.completed && !t.happens["process"] && !t.happens["start"]).length;
			var notesCount = timelineNotes.length;
			
			if (todoCount == 0 && processCount == 0 && overdueCount == 0) {
				var motivation = "☕️ Wow, looks like an empty day.<br>Relax!"
			} else if (todoCount > 0 && todoCount < 4 && overdueCount < 3) {
				var motivation = "👍 Only " + todoCount + " task/s for today.<br>You can do this easily!"
			} else if (todoCount > 0 && todoCount < 4 && overdueCount >= 3 && overdueCount < 5) {
				var motivation = "😀 Only " + todoCount + " task/s for today.<br>But keep an eye on the overdue tasks!"
			} else if (todoCount >= 3 && overdueCount < 3) {
				var motivation = "🐥 Few things to do.<br>The faster you start, the faster you finish."
			} else if (todoCount >= 10 && overdueCount < 3) {
				var motivation = "⏰ Use your time wisely,<br>you have a lot to do today!"
			} else if (processCount >= 6) {
				var motivation = "🥯 You are working on so many tasks at once.<br>Don't forget the break!"
			} else if (overdueCount >= 3 && overdueCount < 6) {
				var motivation = "🐰 Unfortunately, you still have some unfinished tasks.<br>But the situation is not yet dramatic, so cheer up."
			} else if (overdueCount >= 6  && overdueCount < 10) {
				var motivation = "👀 Your unfinished tasks could slowly become a problem.<br>Keep the ball rolling!"
			} else if (todoCount >= 8  && overdueCount >= 8) {
				var motivation = "🚧 Please take care of yourself!<br>Your situation is really tense at the moment.<br>I believe in you."
			};
			
			var todayContent = "<div class='todayHeader'>Today</div>"
			todayContent += "<div class='counters'>"
			todayContent += "<div class='counter' id='todo'><div class='count'>" + todoCount + "</div><div class='label'>To Do</div></div>"
			todayContent += "<div class='counter' id='overdue'><div class='count'>" + overdueCount + "</div><div class='label'>Overdue</div></div>"
			todayContent += "<div class='counter' id='process'><div class='count'>" + processCount + "</div><div class='label'>Process</div></div>"
			todayContent += "</div>"
			todayContent += "<div class='motivation'>" + motivation + "</div>"
			
			content += todayContent;
		};
		
		tasksFiltered.forEach(function(item) {
			
			var file = getFilename(item.path);
			var link = item.link.path.replace("'", "&apos;");
			var text = item.text;
			var info = "";
			var color = getMetaFromNote(item, "color");
			var cls = Object.keys(item.happens).find(key => item.happens[key] === timelineDates[i].toString());
			
			if (item.priorityLabel) {
				info += "<div class='priority'><div class='icon'>" + priorityIcon + "</div><div class='label'>" + item.priorityLabel + "</div></div>";
			};
			
			if (item.repeat) {
				info += "<div class='repeat'><div class='icon'>" + repeatIcon + "</div><div class='label'>" + item.repeat.replace("🔁", "") + "</div></div>";
			};
			
			item.tags.forEach(function(tag) {
				var tagText = tag.replace("#","");
				var hexColorMatch = tag.match(/([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\/(.*)/);
				if (hexColorMatch) {
					var style = "style='--tag-color:#" + hexColorMatch[1] + ";--tag-background:#" + hexColorMatch[1] + "1a'";
					tagText = hexColorMatch[2];
				};
				info += "<div class='tag' " + style + "><div class='icon'>" + tagIcon + "</div><div class='label'>" + tagText + "</div></div>";
				text = text.replace(tag, "");
			});
			
			var task = "<a class='internal-link' href='" + link + "'><div class='task " + cls + "' style='--task-color:" + color + "'><div class='timeline'><div class='icon'>" + eval(cls+"Icon") + "</div><div class='stripe'></div></div><div class='lines'><div class='line'><div class='file'>" + file + "</div></div><div class='line'>" + info + "</div><div class='content'>" + text + "</div></div></div></a>";
			content += task;
		});
		
		notesFiltered.forEach(function(note) {
			var star = "<a class='internal-link' href='" + note.path + "'><div class='task star'><div class='timeline'><div class='icon'>" + starIcon + "</div><div class='stripe'></div></div><div class='lines'><div class='line'><div class='file'>" + note.name + "</div></div><div class='line'></div><div class='content'></div></div></div></a>";
			content += star;
		});

		// Add Task For Today
		if (timelineDates[i] == today) {
			var newTask = "<a class='internal-link' href='" + dailyNoteFolder + timelineDates[i] + "'><div class='task add'><div class='timeline'><div class='icon'>" + addIcon + "</div></div><div class='lines'><div class='line'><div class='file'>Add task for today</div></div></div></div></a>";
			content += newTask;
		};
		
		// Set Date Template
		var date = "<div class='dateLine'><div class='date'>" + date + "</div><div class='relative'>" + relative + "</div></div><div class='content'>" + content + "</div>"
		
		// Append To Root Node
		rootNode.querySelector("span").appendChild(dv.el("div", date, {cls: "details " + detailsCls, attr: {"data-year": year}}));
	};
};
