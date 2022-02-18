---
defines-react-components: true
---

```jsx:component:ColorfulClock
const [date, setDate] = useState(new Date)

useEffect(()=>{
	const timerId = setInterval(()=>{
		setDate(new Date)
	},1000)
	return ()=>{clearInterval(timerId)}
})

//moment().locale('en');
moment().locale('zh-cn');
let formatDate = moment().format("dddd-MMMM-D-H-mm-ss-a").split("-")
let secProgress = formatDate[5] / 60
let minProgress = (formatDate[4]) / 60
let hourProgress = (formatDate[3]) / 24
let dayProgress = (formatDate[2]) / 31
//console.log(formatDate[2]/31)

return (
<div id="clock" class="progress-clock">
	<button class="progress-clock__time-date" data-group="d" type="button">
		<small data-unit="w">{formatDate[0]}</small><br/>
		<span data-unit="mo">{formatDate[1]}</span>
		<span data-unit="d">{formatDate[2]}</span>
	</button>
	<button class="progress-clock__time-digit" data-unit="h" data-group="h" type="button">{formatDate[3]}</button><span class="progress-clock__time-colon">:</span><button class="progress-clock__time-digit" data-unit="m" data-group="m" type="button">{formatDate[4]}</button><span class="progress-clock__time-colon">:</span><button class="progress-clock__time-digit" data-unit="s" data-group="s" type="button">{formatDate[5]}</button>
	<span class="progress-clock__time-ampm" data-unit="ap">{formatDate[6]}</span>
	<svg class="progress-clock__rings" width="256" height="256" viewBox="0 0 256 256">
		<defs>
			<linearGradient id="pc-red" x1="1" y1="0.5" x2="0" y2="0.5">
				<stop offset="0%" stop-color="hsl(343,90%,55%)" />
				<stop offset="100%" stop-color="hsl(323,90%,55%)" />
			</linearGradient>
			<linearGradient id="pc-yellow" x1="1" y1="0.5" x2="0" y2="0.5">
				<stop offset="0%" stop-color="hsl(43,90%,55%)" />
				<stop offset="100%" stop-color="hsl(23,90%,55%)" />
			</linearGradient>
			<linearGradient id="pc-blue" x1="1" y1="0.5" x2="0" y2="0.5">
				<stop offset="0%" stop-color="hsl(223,90%,55%)" />
				<stop offset="100%" stop-color="hsl(203,90%,55%)" />
			</linearGradient>
			<linearGradient id="pc-purple" x1="1" y1="0.5" x2="0" y2="0.5">
				<stop offset="0%" stop-color="hsl(283,90%,55%)" />
				<stop offset="100%" stop-color="hsl(263,90%,55%)" />
			</linearGradient>
		</defs>
		<g data-units="d">
			<circle class="progress-clock__ring" cx="128" cy="128" r="74" fill="none" opacity="0.1" stroke="#e13e78" stroke-width="12" />
			<circle class="progress-clock__ring-fill" data-ring="mo" cx="128" cy="128" r="74" fill="none" stroke="#e13e78" stroke-width="12" stroke-dasharray="465 465" stroke-dashoffset={(1-dayProgress)*465} stroke-linecap="round" transform="rotate(-90,128,128)" />
		</g>
		<g data-units="h">
			<circle class="progress-clock__ring" cx="128" cy="128" r="90" fill="none" opacity="0.1" stroke="#e79742" stroke-width="12" />
			<circle class="progress-clock__ring-fill" data-ring="d" cx="128" cy="128" r="90" fill="none" stroke="#e79742" stroke-width="12" stroke-dasharray="565.5 565.5" stroke-dashoffset={(1-hourProgress)*565.5} stroke-linecap="round" transform="rotate(-90,128,128)" />
		</g>
		<g data-units="m">
			<circle class="progress-clock__ring" cx="128" cy="128" r="106" fill="none" opacity="0.1" stroke="#4483ec" stroke-width="12" />
			<circle class="progress-clock__ring-fill" data-ring="h" cx="128" cy="128" r="106" fill="none" stroke="#4483ec" stroke-width="12" stroke-dasharray="666 666" stroke-dashoffset={(1-minProgress)*666} stroke-linecap="round" transform="rotate(-90,128,128)" />
		</g>
		<g data-units="s">
			<circle class="progress-clock__ring" cx="128" cy="128" r="122" fill="none" opacity="0.1" stroke="#8f30eb" stroke-width="12" />
			<circle class="progress-clock__ring-fill" data-ring="m" cx="128" cy="128" r="122" fill="none" stroke="#8f30eb" stroke-width="12" stroke-dasharray="766.5 766.5" stroke-dashoffset={(1-secProgress)*766.5} stroke-linecap="round" transform="rotate(-90,128,128)" />
		</g>
	</svg>
</div>

)
```

## 调用方式
```jsx:
**<ColorfulClock>**</ColorfulClock>
```
