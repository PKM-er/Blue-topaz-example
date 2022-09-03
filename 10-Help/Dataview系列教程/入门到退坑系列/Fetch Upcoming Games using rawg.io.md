---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---
This is an example of getting game data from rawg.io. It fetches upcoming games within the month that people seem to be interested in, and displays via dataviewjs.

You need to acqurie a free API key from rawg.io. You can find more information on their pages and documentation.

```
const myHeaders = new Headers({
  "x-rapidapi-key": "e6ef05302emsh9c46dd59d7ac5d1p13a2d8jsneb37aae7d452",
  "x-rapidapi-host": "rawg-video-games-database.p.rapidapi.com"
});
var today = luxon.DateTime.local().toFormat("yyyy-MM-dd");
var month = luxon.DateTime.local().plus({months: 1}).toFormat("yyyy-MM-dd");
var key = "YOUR KEY HERE";
const url = `https://api.rawg.io/api/games?key={key}&dates=${today},${month}&ordering=-added`;
const myRequest = new Request(url, {
  method: 'GET',
  headers: myHeaders,
  cache: 'default',
});
function compareDate(a, b) {
  var out = luxon.DateTime.fromISO(a.released).toSeconds() -  luxon.DateTime.fromISO(b.released).toSeconds();
  return out;
}

var topResults = [];

// apparently this async mode works better post-dv-update.
fetch(url)
  .then(response => response.json())
  .then(data => {
for (var r of data.results) {
  if (r.added >= 10) {
  topResults.push(r);
  } else {
  break;
  }
}
for (var r of topResults.sort(compareDate)) {
dv.header(3, r.name);
dv.paragraph(`![](${r.background_image})`);
dv.paragraph(`[Look Up](https://google.com/search?q=${encodeURIComponent(r.name + " game") + "&btnI"})`);
dv.paragraph(`**Releasing**: ${r.released}`);
dv.paragraph(`**Genres**: ${r.genres.map(g => g.name).join(", ")}`);
dv.paragraph(`**Platforms**: ${r.platforms.map(p => p['platform'].name).join(", ")}`);

}
})
```