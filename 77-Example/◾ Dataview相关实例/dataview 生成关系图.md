---
Direction: "LR" # LR | TD
ShowCode: false # Code or Diagram
SubGroupNames: ["Authors", "Fiction", "Non-Fiction"] # Subgroup names ("" or " " allowed)
RemoveOrphans: false #Only keep nodes that link to something
KeepLinksWithoutSource: true #Only draw links that start from an imported node
KeepLinksWithoutDest: true #Only draw links that end at an imported node

# Array of DQL queries to pull in nodes - see ReadMe
# | Link | DisplayName | OpenBracket | CloseBracket | Style |
Nodes:
 - 'TABLE file.name, "([", "])", "yellow" FROM  #book where !contains(file.folder, "88-Template")'


# Array of DQL queries to pull in relationships between nodes - see ReadMe
# | Source | Destination | Arrow |
Links:  
 - 'TABLE WITHOUT ID status, file.name, "" FROM #book WHERE status FLATTEN status'

# Custom node styles if you don't like the built in colours (like red, purple, etc) - see ReadMe
Styles: 
 - 'classDef Custom1 fill:#DDEEFF,color:#000,stroke:#000,stroke-width:1px'
---
# Mermaid Output
``` dataviewjs
//YAML Settings
let c = dv.current();
let direction = c.Direction ?? "LR"; 
let showAsCode = c.ShowCode ?? false;
let subGroups = c.SubGroupNames ?? [];
let removeOrphans = c.RemoveOrphans ?? false;
let keepLinksWithoutSource = c.KeepLinksWithoutSource ?? true;
let keepLinksWithoutDest = c.KeepLinksWithoutDes ?? true;

var nodeQueries = c.Nodes ?? ['TABLE WITHOUT ID "[[No Nodes]]", "No Nodes", "[", "]", "red" FROM "" LIMIT 1'];
var linkQueries = c.Links ?? [];
var styles = c.Styles ?? [];

//DEFAULTS
let def = {open: "[", close: "]", style: "default"};
styles.push("classDef red fill:#f2b5bd88,color:#c94f60,stroke:#c94f60,stroke-width:1px");
styles.push("classDef orange fill:#efc5b388,color:#c76a43,stroke:#c76a43,stroke-width:1px");
styles.push("classDef yellow fill:#f2d9b588,color:#b68035,stroke:#b68035,stroke-width:1px");
styles.push("classDef green fill:#bde0bd88,color:#3c9f3e,stroke:#3c9f3e,stroke-width:1px");
styles.push("classDef mint fill:#c9e4d688,color:#24a864,stroke:#24a864,stroke-width:1px");
styles.push("classDef aqua fill:#c0dede88,color:#339999,stroke:#339999,stroke-width:1px");
styles.push("classDef blue fill:#cbcde188,color:#6d73b0,stroke:#6d73b0,stroke-width:1px");
styles.push("classDef purple fill:#d4c0e388,color:#8c59b1,stroke:#8c59b1,stroke-width:1px");
styles.push("classDef pink fill:#e6c1d788,color:#b54a88,stroke:#b54a88,stroke-width:1px");
styles.push("classDef grey fill:#d3cfcf88,color:#7e7273,stroke:#7e7273,stroke-width:1px");
styles.push("classDef default fill:#88888888,color:#000,stroke:#000,stroke-width:1px");

//--------------
//SHOULDN'T NEED TO CHANGE CODE BELOW HERE
//--------------

//FRONTMATTER STRING
let mFront = (showAsCode ? "```\n" : "```mermaid\n" );
mFront += "graph " + direction + "\n\n";

//CREATE ARRAY OF ALL NODES
var nodesArray = [];
for (var q = 0; q < nodeQueries.length; q++) {
	let DQLResults = await dv.tryQuery(nodeQueries[q]);
	DQLResults.values.forEach(node => {
		let ref = getNodeRefName(node[0]);
		let ID = getLegalCharacters(ref);
		let display = cleanLabel(node[0], node[1]);
		let nodeObj = {qID: q, ID:ID, link:ref, name, display:display, 
						open:node[2], close:node[3], style:node[4], linked: false}
		nodesArray.push(nodeObj);
	});
};

//CREATE MERMAID STRING FOR LINKS (CHECK FOR ORPHANS)
nodesArray = dv.array(nodesArray);
var mLinks = "%%---LINKS---\n";
for (var q = 0; q < linkQueries.length; q++) {
	let DQLResults = await dv.tryQuery(linkQueries[q]);
	DQLResults.values.forEach(link => {
		let sRef = getNodeRefName(link[0]);
		let sID = getLegalCharacters(sRef); 
		let dRef = getNodeRefName(link[1]); 
		let dID = getLegalCharacters(dRef); 
		let arrow = (link[2] == "" ? " --> " : " " + link[2] + " ");

		//Find nodes if they were imported explicitly
		let sIndex = nodesArray.ID.indexOf(sID);
		let dIndex = nodesArray.ID.indexOf(dID);

		//Mark those nodes as linked if they were found
		if (sIndex >= 0) {nodesArray[sIndex].linked = true;}
		if (dIndex >= 0) {nodesArray[dIndex].linked = true;}
		
		//if both nodes exist OR we have permission to create them
		if ((sIndex >= 0 || keepLinksWithoutSource) && 
			(dIndex >= 0 || keepLinksWithoutDest)) {

			var sString = "    ";
			if (sIndex >= 0) { sString += sID; }
			else { sString += getNodeDef(sID, def.open, "", 
								cleanLabel(sRef), def.close, def.style); }
			var dString = "";
			if (dIndex >= 0) { dString += dID; }
			else { dString += getNodeDef(dID, def.open, "", 
								cleanLabel(dRef), def.close, def.style); }
							
			mLinks += sString + arrow + dString + "\n";
		}
	});
	mLinks = mLinks + "\n";
};

//CREATE MERMAID STRING FOR THE NODES
var mNodes = "%%---NODES---\n";
var qID = -1;
var subGroup = "";
nodesArray.forEach(n => {
	//if node is linked, or I don't care about orphans
	if (n.linked || !removeOrphans) {
		//new subgroup
		if (qID != n.qID) {
			if (subGroup != "") {mNodes += "end\n\n"} //close previous
			qID = n.qID;
			subGroup = subGroups[qID] ?? "";
			if (subGroup != "") {
				mNodes += "subgraph SG" + qID + " [<B>" + subGroup + "<B>]\n";
			}
		}
		mNodes += "    "
		mNodes += getNodeDef(n.ID, n.open, n.link, n.display, n.close, n.style);
	}
});
if (subGroup != "") {mNodes += "end\n\n"}

//STYLE CLASSES
var styleClasses = "%%---STYLES---\n";
for (var s = 0; s < styles.length; s++) {
	styleClasses += styles[s] + "\n\n"
}

//OUTPUT 
dv.span(mFront + mNodes + mLinks + styleClasses + "```");


//--------------
//HELPER FUNCTIONS
//--------------
function getNodeDef(ID, open, href, display, close, style) {
	var def = "";
	def += ID + open + "\"<div style='padding:5px;'>";
	def += (href != "" ? "<a class='internal-link' href='" + href + ".md'>" : "");
	def += display;
	def += (href != "" ? "</a>" : "");
	def += "</div>\"" + close + ":::" + style + "\n";
	return def
}

function getNodeRefName(node) {
	// return file name if valid page, otherwise return a string representation
	if (dv.page(node)) { 
		return dv.page(node).file.name;
	} else { 
		return cleanLinkyString(node);
	}	
}

function getLegalCharacters(name) {
	//Remove characters not allowed in Mermaid IDs
	return name.replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]/g, '');
}

function cleanLinkyString(link) {
	//Remove [[ | ]] from linky strings
	return String(link).split("|")[0].replace(/[^\u4e00-\u9fa5_a-zA-Z0-9\[\]]/g, '');
}

function cleanLabel(node, display) {
	//Try to clean up the display name, but if empty - infer from node
	var wrapped = "";
	if (!display || display == "") { 
		wrapped = getNodeRefName(node);
	} else {
		wrapped = cleanLinkyString(String(display));
	}
	wrapped = wrapped.replace(/(?![^\n]{1,20}$)([^\n]{1,20})\s/g, '$1\<br>');
	wrapped = wrapped.replace(/[❝❞]/g,'\\"');
	return wrapped
}
