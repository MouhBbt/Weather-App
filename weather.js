// import {axios} from 'axios'
// const axios = require('axios
import axios from 'axios'
export async function getWeather(lat, lon, timezone) {
    return await axios.get(
      "https://api.open-meteo.com/v1/forecast?current=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&timeformat=unixtime",
      {
        params: {
          latitude: lat,
          longitude: lon,
          timezone,
        },
      }
    ).then(({data}) => {
        return {
            current:parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data)
        }
    });
  } 

function parseCurrentWeather({ current, daily }) {
  const {
    temperature_2m: currentTemp,
    windspeed_10m: windSpeed,
    weathercode: iconCode,
  } = current
  const {
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
    apparent_temperature_max: [maxFeelsLike],
    apparent_temperature_min: [minFeelsLike],
    precipitation_sum: [precip],
  } = daily

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    highFeelsLike: Math.round(maxFeelsLike),
    lowFeelsLike: Math.round(minFeelsLike),
    windSpeed: Math.round(windSpeed),
    precip: Math.round(precip * 100) / 100,
    iconCode,
  }
}
function parseDailyWeather({ daily }) {
  return daily.time.map((time,index) => {
    return {
      timestamp: time *1000,
      iconCode:daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index])
    }
  })
}
function parseHourlyWeather( { hourly ,current}) {
  return hourly.time.map((time, index )=> {
    return {
      timestamp: time *1000,
      iconCode: hourly.weathercode[index],
      temp: Math.round(hourly.temperature_2m[index]),
      feelslike: Math.round(hourly.apparent_temperature[index]),
      windSpeed: Math.round(hourly.windspeed_10m[index]),
      precip: Math.round(hourly.precipitation   [index]*100)/100,

    }
  }).filter(({timestamp})=> timestamp >= current.time *1000)
}


// const  getW =async (lat,lon, timezone)=>{
//     try {
//         console.log('tet') 
//         const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,precipitation,weathercode,windspeed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,windspeed_10m_max&timezone=auto`)
//         console.log(res.body)
//     } catch (error) {
//         console.log('error')    
//     }
// }


export default getWeather   
