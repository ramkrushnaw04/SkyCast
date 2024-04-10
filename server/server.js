const cors = require('cors')
const express = require('express')
const app = express()
const savedCity = require('../schemas/savedCities')
const mongoose = require('mongoose')

const port = 3000
const units = 'metric'
const key = '1779406e9f90ca7ca89c61efaf59681d'


app.use(express.json()) // used to access json data from request body
app.use(cors({
    origin: 'http://127.0.0.1:5500'
}))


// // convert utc to ist
// function convertTime(timeStr) {
//     let hours = parseInt(timeStr.split(':')[0])
//     let minutes = parseInt(timeStr.split(':')[1])
//     let carry = 0;

//     if(minutes + 30 > 59) {
//         carry = 1
//         minutes = (minutes + 30) - 60
//     }
//     else {
//         carry = 0
//         minutes = minutes + 30
//     }

//     if(hours + 5 + carry > 24)
//         hours = hours + carry + 5 - 24
//     else 
//         hours = hours + carry + 5

//     hours = hours.toString()
//     minutes = minutes.toString()

//     if(hours.length == 1)
//         hours = '0' + hours
//     if(minutes.length == 1)
//         minutes = '0' + minutes

//     return hours.toString() + ':' + minutes.toString() + ':00'
// }



// function convertEpochToHumanReadable(epoch) {
//     const date = new Date(epoch * 1000);
//     const options = {
//         hour12: false // Set to false to display time in 24-hour format
//     };
//     return date.toLocaleString(undefined, options);
// }

async function getAllSavedCities() {
    const cities = await savedCity.find()
    return cities
}


function getDayOfWeek(epoch) {
    const date = new Date(epoch*1000) // must be in miliseconds
    return date.getDay()
}


function convertEpochToHumanReadable(epoch, timeZone) {
    const date = new Date(epoch * 1000)
    const options = {
        timeZone: timeZone, 
        year: 'numeric',   
        month: 'numeric',  
        day: 'numeric',    
        hour: '2-digit',   
        minute: '2-digit', 
        second: 'numeric' ,
        hour12: false
    }
    const formatter = new Intl.DateTimeFormat('en-US', options)
    return formatter.format(date)
}


app.get('/get-all-saved-cities', async (req, res) => {
    await mongoose.connect('mongodb://localhost:27017/savedCities')
    const cities = await getAllSavedCities()
    await mongoose.disconnect()
    res.json(cities)
})


app.get('/get-cities/:city', async (req, res) => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${req.params.city}&limit=20&appid=${key}`)
    const data = await response.json()
    res.json(data)
})


app.get('/geo-info/:city', async (req, res) => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${req.params.city}&limit=50&appid=${key}`)
    const data = await response.json()
    res.json(data)
})

app.get('/current-weather/:lat/:lon', async (req, res) => {
    const responce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${req.params.lat}&lon=${req.params.lon}&appid=${key}&units=${units}`)
    const data = await responce.json()
    res.json(data)
})

app.get('/time/:lat/:lon', async (req, res)=>{
    const responce = await fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${req.params.lat}&longitude=${req.params.lon}`)
    const data = await responce.json()
    res.json(data)
})

app.post('/weather-forecast/:lat/:lon', async (req, res) => {
    const timeZone = req.body.timeZone
    console.log(timeZone)
    const responce = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${req.params.lat}&lon=${req.params.lon}&appid=${key}&units=${units}`)
    const data = await responce.json()

    let hourlyTemp = []
    let hours = []
    let fiveDayForcast = []

    let preDate = data.list[0].dt_txt.split(' ')[0].split('-')[2]

    let min = Infinity
    let max = -Infinity
    let avg = 0
    let count = 0
    let pop = 0

    let preData = data.list[0]

    let hoursToShow = 24 // keeps track of temp of how many hours is to be shown in the graph
    data.list.forEach(tempData => {

        const dateTime = convertEpochToHumanReadable(tempData.dt, timeZone).split(', ')
        const time = dateTime[1]
        const date = dateTime[0]

        const currentDate = date.split('/')[1]

        const currMinTemp = tempData.main.temp_min
        const currMaxTemp = tempData.main.temp_max
        const currTemp = tempData.main.temp
        const currHour = time.split(':')[0]

        
        if(currentDate == preDate)
        {
            min = Math.min(min, currMinTemp)
            max = Math.max(max, currMaxTemp)
            pop += tempData.pop
            avg += currTemp
            count++
        }
        else
        {
            // fiveDayForcast.push([Math.floor(min), Math.ceil(max), Math.floor(avg/count)-1, preDate+' / '+currMonth, data.list[0].weather[0].icon, Math.floor(pop*100/count)])
            fiveDayForcast.push([Math.floor(min), Math.ceil(max), Math.floor(avg/count)-1, getDayOfWeek(tempData.dt), preData.weather[0].icon, Math.floor(pop*100/count)])
            preDate = currentDate
            count = 0
            min = currMinTemp
            max = currMaxTemp
            pop = 0
            avg = currTemp
            preData = tempData
        }

        if(hoursToShow > 0) {
            hours.push(currHour)
            hourlyTemp.push(currTemp)
        }
        hoursToShow--
    })
    // res.json(data)
    res.json({hours: hours, hourlyTemp: hourlyTemp, fiveDayForcast: fiveDayForcast})
})


app.get('/aqi/:lat/:lon', async (req, res) => {
    const responce = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${req.params.lat}&lon=${req.params.lon}&appid=${key}`)
    const data = await responce.json()
    res.json(data)
})

app.get('/country-name/:code', async (req, res) => {
    const responce = await fetch(`https://restcountries.com/v3.1/alpha/${req.params.code}`)
    const data = await responce.json()
    res.json(data[0].name.common)
})


app.post('/save-city', async (req, res)=> {
    await mongoose.connect('mongodb://localhost:27017/savedCities')
    const city = new savedCity(req.body)
    
    const result = await savedCity.findOne(req.body)
    if(!result) {
        await city.save()
        await mongoose.disconnect()
        res.send('1')
    }
    else {
        await mongoose.disconnect()
        res.send('0')
    }
})


app.post('/delete-city', async (req, res) => {
    await mongoose.connect('mongodb://localhost:27017/savedCities')
    await savedCity.deleteOne(req.body)
    await mongoose.disconnect()
    res.send()
})

// check if city is present in db
app.post('/city-present', async (req, res) => {
    await mongoose.connect('mongodb://localhost:27017/savedCities')
    const ans = await savedCity.findOne(req.body)
    if(ans) {
        await mongoose.disconnect()
        res.send('1')
    }
    else {
        await mongoose.disconnect()
        res.send('0')
    }
})




app.listen(port, ()=>{
})