---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---


```
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  dv.paragraph('Your current position is:');
  dv.paragraph(`Latitude : ${crd.latitude}`);
  dv.paragraph(`Longitude: ${crd.longitude}`);
  dv.paragraph(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  dv.paragraph(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);
```

Get current location