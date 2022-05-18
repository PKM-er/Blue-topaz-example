---
defines-react-components: true
---

```jsx:component:Weather
//First debut by cuman in 🥑Blue Topaz example 
//2022-05-18
const isDarkMode = app.vault.getConfig("theme") === "obsidian";
let color='';
 if (isDarkMode) color='&color=d2d1cd';
const weathersrc='https://tianqiapi.com/api.php?style=ta&skin=pear&fontsize=13&align=&paddingtop=2&paddingleft=15'+color;
return (
	<>
		<iframe
      title="iframe"
      src={weathersrc}
      style={{ width: 245, border: 0, height: 20 }}
      sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      scrolling="no"
    ></iframe>
	</>
)
```

```jsx:
<Weather></Weather>
```

