let {pages, view} = input;

// Get Notes And Sort
if (pages=="") { pages = dv.pages() } else { if (pages.startsWith("dv.")) { pages = eval(pages) } else { pages = dv.pages(pages) } };
pages = pages.sort(n => n.file.mtime, "desc");

// Set Variables
var imgExtensions = ['.jpg','.jpeg','.png','.bmp','.tif','.gif'];
var noteTemplate = "<div class='inner'><a class='internal-link' href='{{filePath}}'><div class='itemHeader'><div class='fileName'>{{fileName}}</div><div class='fileDate'>{{fileDate}}</div></div><div class='itemContent'><div class='fileDescription'>{{fileDescription}}</div><div class='fileAttachments'>{{fileAttachments}}</div></div></div></a></div>";
var attachmentTemplate = "<div class='file'><div class='fileExtension'>{{fileExtension}}</div></div>"

// Set Root Node
const rootNode = dv.el("div", "", {cls: "NotesList", attr: {view: view}});

// Loop Notes To Build ListView
pages.forEach(function(page) {
		
		// Get File Meta
		var fileName = page.file.name;
		var fileDate = moment(page.file.mtime.toString()).fromNow();
		var filePath = app.vault.getAbstractFileByPath(page.file.path);
		var filePathName = filePath.name;
		var fileOutlinks = page.file.outlinks;
		var fileAttachments = "";
		var fileAttachmentsCounter = fileOutlinks.length;
	
		// Get Attachments
		if (fileOutlinks) {
			fileOutlinks.forEach(function(outlink) {
				var outlinkPath = app.vault.getResourcePath(outlink);
				var outlinkIsImage = false;
				
				// Set Image Attachments
				imgExtensions.forEach(function(extension) {
					if (outlinkPath.toUpperCase().contains(extension.toUpperCase())) {
						fileAttachments += "<img src='" + outlinkPath + "' />";
						outlinkIsImage = true;
					};
				});
				
				// Set File Attachments
				if (!outlinkIsImage) {
					var ext = outlinkPath.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
					if (ext) {
						fileAttachments += attachmentTemplate.replace("{{fileExtension}}", ext[1].toUpperCase());
					};
				};
			});
		};
	
		// Optimize Description
		app.vault.read(filePath).then(function(fileDescription) {
			fileDescription = fileDescription.substring(0,500);
			fileDescription = fileDescription.replace(/(\!\[\[).*(\]\])/gm, "");
			fileDescription = fileDescription.replace(/(\!\[).*(\])/gm, "");
			fileDescription = fileDescription.replace(/(\[).*(\]\().*(\))/gm, "");
			fileDescription = fileDescription.replaceAll("---", "");
			fileDescription = fileDescription.replaceAll("*", "");
			fileDescription = fileDescription.replaceAll("|", "");
			fileDescription = fileDescription.replaceAll("![", "");
			fileDescription = fileDescription.replaceAll("[", "");
			fileDescription = fileDescription.replaceAll("]", "");
			fileDescription = fileDescription.replaceAll("#", "");
			fileDescription = fileDescription.replaceAll("##", "");
			fileDescription = fileDescription.replaceAll("###", "");
			fileDescription = fileDescription.replaceAll("####", "");
			fileDescription = fileDescription.replaceAll("#####", "");
			fileDescription = fileDescription.replaceAll("######", "");
			fileDescription = fileDescription.replaceAll("```", "");
			fileDescription = fileDescription.replaceAll(">", "");
			fileDescription = fileDescription.replaceAll("<", "");
			fileDescription = fileDescription.replaceAll("$=", "");
			fileDescription = fileDescription.replaceAll("  ", " ");
			fileDescription = fileDescription.replaceAll(/(\r\n|\n|\r)/gm, " "); // Remove Linebreaks
			fileDescription = fileDescription.replace(/^\ /, ""); // Remove Leading Whitespace
			var listViewItem = noteTemplate.replace("{{filePath}}",filePathName).replace("{{fileName}}",fileName).replace("{{fileDate}}",fileDate).replace("{{fileDescription}}",fileDescription).replace("{{fileAttachments}}",fileAttachments);
			
			// Append To Root Node
			rootNode.querySelector("span").appendChild(dv.el("div", listViewItem, {cls: "listViewItem", attr: {outlinks: fileAttachmentsCounter}}));
		});
});
