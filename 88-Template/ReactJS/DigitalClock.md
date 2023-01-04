---
defines-react-components: true
---

```jsx:component:DigitalClock
const [date, setDate] = useState(new Date)
useEffect(()=>{
	const timerId2 = setInterval(()=>{
		setDate(new Date)
	},1000)
	return ()=>{clearInterval(timerId2)}
})

//moment.locale('en-us');
moment.locale('zh-cn');
let formatDate = moment().format("dddd-MMM-DD-H-mm-ss-a").split("-")
let secProgress = formatDate[5] / 60
let minProgress = (formatDate[4]) / 60
let hourProgress = (formatDate[3]) / 24
let dayProgress = (formatDate[2]) / 31
//console.log(formatDate[2]/31)

return (
<div className="DPDC" cityid="9701" lang="en" id="DigitalClock" ampm="false" nightsign="true" sun="false">
	<div className="DPDCt">
		<span className="DPDCth">{formatDate[3]}</span><span className="DPDCtm">{formatDate[4]}</span><span className="DPDCts">{formatDate[5]}</span>
	</div>
	<div className="DPDCd">
		<span className="DPDCdt">{formatDate[1]}{formatDate[2]}  {formatDate[0]}</span>
	</div>
	</div>
)
```

## 调用方式

```jsx:
<DigitalClock></DigitalClock>
```
