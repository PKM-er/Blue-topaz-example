---
source: "https://publish.obsidian.md/napkinium/Ideas/Dataview/Learnings/Dataview+Learnings"
---

Reference Arbitrary file relatively with File URL

Does _not_ work on Mobile since there's no `basePath`.

```
const os = navigator.platform;
const extraSlash = os === "Win32" ? '/' : '';
const path = require('path');
const vaultPath = dv.app.vault.adapter.basePath;
const internalPath = "Assets/IMG_0049.jpg";
dv.paragraph(`[Link](file://${extraSlash}${encodeURI(path.join(vaultPath, internalPath))})`);
```

Reference Arbitrary file relatively with File URL