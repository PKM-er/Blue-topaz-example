module.exports = colorclock
let quickAddApi;

async function colorclock (params) {
    ({quickAddApi} = params) 
//查看文件是否存在

	function constructor(qs) {
		el = document.querySelector(qs);
		time = 0;
		updateTimeout = null;
		ringTimeouts = [];
		update();
	}
	function getDayOfWeek(day) {
	
		 switch (day) {
			case 1:
				return "Monday";
			case 2:
				return "Tuesday";
			case 3:
				return "Wednesday";
			case 4:
				return "Thursday";
			case 5:
				return "Friday";
			case 6:
				return "Saturday";
			default:
				return "Sunday";
		}
		
	}
	function getMonthInfo(mo,yr) {	
	switch (mo) {
						case 1:
							return { name: "February", days: yr % 4 === 0 ? 29 : 28 };
						case 2:
							return { name: "March", days: 31 };
						case 3:
							return { name: "April", days: 30 };
						case 4:
							return { name: "May", days: 31 };
						case 5:
							return { name: "June", days: 30 };
						case 6:
							return { name: "July", days: 31 };
						case 7:
							return { name: "August", days: 31 };
						case 8:
							return { name: "September", days: 30 };
						case 9:
							return { name: "October", days: 31 };
						case 10:
							return { name: "November", days: 30 };
						case 11:
							return { name: "December", days: 31 };
						default:
							return { name: "January", days: 31 };
					}
		
	}
	function update() {
		let time = new Date();

		if (el) {
			// date and time
			const dayOfWeek = time.getDay();
			const year = time.getFullYear();
			const month = time.getMonth();
			const day = time.getDate();
			const hr = time.getHours();
			const min = time.getMinutes();
			const sec = time.getSeconds();
			const dayOfWeekName = getDayOfWeek(dayOfWeek);
			const monthInfo = getMonthInfo(month,year);
			const m_progress = sec / 60;
			const h_progress = (min + m_progress) / 60;
			const d_progress = (hr + h_progress) / 24;
			const mo_progress = ((day - 1) + d_progress) / monthInfo.days;
			const units = [
				{
					label: "w",
					value: dayOfWeekName
				},
				{
					label: "mo",
					value: monthInfo.name,
					progress: mo_progress
				},
				{
					label: "d", 
					value: day,
					progress: d_progress
				},
				{
					label: "h", 
					value: hr > 12 ? hr - 12 : hr,
					progress: h_progress
				},
				{
					label: "m", 
					value: min < 10 ? "0" + min : min,
					progress: m_progress
				},
				{
					label: "s", 
					value: sec < 10 ? "0" + sec : sec
				},
				{
					label: "ap",
					value: hr > 12 ? "PM" : "AM"
				}
			];

			// flush out the timeouts
			ringTimeouts.forEach(t => {
				clearTimeout(t);
			});
			ringTimeouts = [];

			// update the display
			units.forEach(u => {
				// rings
				const ring = el.querySelector(`[data-ring="${u.label}"]`);

				if (ring) {
					const strokeDashArray = ring.getAttribute("stroke-dasharray");
					const fill360 = "progress-clock__ring-fill--360";

					if (strokeDashArray) {
						// calculate the stroke
						const circumference = +strokeDashArray.split(" ")[0];
						const strokeDashOffsetPct = 1 - u.progress;

						ring.setAttribute(
							"stroke-dashoffset",
							strokeDashOffsetPct * circumference
						);

						// add the fade-out transition, then remove it
						if (strokeDashOffsetPct === 1) {
							ring.classList.add(fill360);

							ringTimeouts.push(
								setTimeout(() => {
									ring.classList.remove(fill360);
								}, 600)
							);
						}
					}
				}

				// digits
				const unit = el.querySelector(`[data-unit="${u.label}"]`);

				if (unit)
					unit.innerText = u.value;
			});
		}

		clearTimeout(updateTimeout);
		updateTimeout = setTimeout(update.bind(this),1e3);
	}
let el;
let time;
let updateTimeout;
let ringTimeouts;
constructor('#clock');

}
