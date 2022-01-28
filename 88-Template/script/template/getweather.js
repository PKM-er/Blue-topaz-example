async function getWeather(city){

  let result = await fetch("https://wttr.in/"+city+"?format=3").then(async (res) => await res.text());
	result = result.replace(/:/g,'').replace(/\+/g,'');
	return result;
}

module.exports =  getWeather