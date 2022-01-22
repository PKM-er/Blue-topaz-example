async function getWeather(city){
  const result = await fetch("https://wttr.in/"+city+"?format=3")  
  return result.text()  
}

module.exports =  getWeather