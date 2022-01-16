async function getWeather(){
  const result = await fetch("https://wttr.in/郑州?format=3")  
  return result.text()  
}

module.exports =  getWeather