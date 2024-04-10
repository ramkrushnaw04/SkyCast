Chart.defaults.global.defaultFontColor = '#ffffffbf'
const units = "metric"
const key = '1779406e9f90ca7ca89c61efaf59681d'
const bgVideo = document.getElementById('bg-video')
const left = document.getElementsByClassName('left')[0]
const right = document.getElementsByClassName('right')[0]
const tiles = document.getElementById('tiles')
const tempGraphTile = document.getElementById('temp-graph-tile')
const humidityTile = document.getElementById('humidity-tile')
const aqiTile = document.getElementById('aqi-tile')
const weatherForecastTile = document.getElementById('weather-forecast-tile')
const visibilityTile = document.getElementById('visibility-tile')
const feelsLikeTile = document.getElementById('feels-like-tile')
const windTile = document.getElementById('wind-tile')
const pressureTile = document.getElementById('pressure-tile')
const sunCycle = document.getElementById('sun-cycle-tile')
const mainTime = document.getElementById('main-time')
const gridColor = '#ffffffbf'
const graphTextColor = '#ffffffbf'
const graphPointColor = "#8c8c8c7a"
const graphAxisColor = '#7d7b7bb3'
const searchCityInput = document.getElementById('searchCityInput')
const searchCities = document.getElementById('search-cities')
const cityName = document.getElementById('cityName')
const currTemp = document.getElementById('currTemp')
const currWeather = document.getElementById('currWeather')
const mainInfo = document.getElementById('main-info')
const mainWeatherIcon = document.getElementById('main-weather-icon')
const aqiReading = document.getElementById('aqi-reading')
const aqiMessage = document.getElementById('aqi-message')
const aqiContents1 = document.getElementById('aqi-contents-1')
const aqiContents2 = document.getElementById('aqi-contents-2')
const aqiRing = document.getElementById('aqi-ring')
const pressureBar = document.getElementById('pressure-bar')
const humidityReading = document.getElementById('humidity-reading')
const feelsLikeReading = document.getElementById('feels-like-reading')
const feelsLikeMinReading = document.getElementById('feels-like-min-reading')
const feelsLikeMaxReading = document.getElementById('feels-like-max-reading')
const forecastUl = document.getElementById('forecast-ul')
const feelsLikeMessage = document.getElementById('feels-like-message')
const needle = document.getElementById('needle')
const windReading = document.getElementById('wind-reading')
const gusts = document.getElementById('gusts')
const savedCities = document.getElementById('saved-cities')
const humidityMessage = document.getElementById('humidity-message')
const rainReading = document.getElementById('rain-reading')
const snowReading = document.getElementById('snow-reading')
const visibilityReading = document.getElementById('visibility-reading')
const visibilityMessage = document.getElementById('visibility-message')
const sunrise = document.getElementById('sunrise')
const sunset = document.getElementById('sunset')
const leftToggle = document.getElementById('left-toggle')
const rightToggle = document.getElementById('right-toggle')
const saveCityButton = document.getElementById('save-city-button')
const loadingWindow = document.getElementById('loading-window')
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const aqiMessageText = ['', 'Clean', 'Satisfactory', 'Moderate', 'Poor', 'Severe']

// default city
let currCityLat = 18.5204
let currCityLon = 73.8567
updateWeather(currCityLat, currCityLon, 'PUNE')

// responsive design
const mobile = window.matchMedia("(min-width: 0px) and (max-width: 610px)")
const tablet = window.matchMedia("(min-width: 611px) and (max-width: 915px)")
const btablet = window.matchMedia("(min-width: 916px) and (max-width: 1320px)")
const desktop = window.matchMedia("(min-width: 1321px)")
const screenBox = document.getElementById('screen-box')

// weather color classes
const weatherColors = {
    'morning' : 'from-sky-500 to-orange-200',
    'afternoon' : 'from-sky-600 to-sky-700',
    'evening' : 'from-[#3758b6] to-[#916541]',
    'night' : 'from-[rgb(21,21,21)] to-[rgb(21,21,20)]',
    'night-rain' : 'from-[#7f7e7c] to-[#423835]'
}

function removeBackgroundColors() {
    screenBox.classList.remove(...weatherColors['morning'].split(' '))
    screenBox.classList.remove(...weatherColors['afternoon'].split(' '))
    screenBox.classList.remove(...weatherColors['evening'].split(' '))
    screenBox.classList.remove(...weatherColors['night'].split(' '))
    screenBox.classList.remove(...weatherColors['night-rain'].split(' '))
    screenBox.classList.remove('bg-[#54aed8]')
}


function changeBackgroundColorByTime(currTime, sunrise, sunset) {

    removeBackgroundColors()

    // morning
    if(currTime > sunrise && currTime < 9) {
        screenBox.classList.add(...weatherColors['morning'].split(' '))
    }
    // day / afternoon
    else if(currTime >= 9 && currTime < sunset) {
        screenBox.classList.add(...weatherColors['afternoon'].split(' '))
    }
    // evening
    else if(currTime >= sunset && currTime < sunset+1) {
        screenBox.classList.add(...weatherColors['evening'].split(' '))
    }
    // night
    else {
        screenBox.classList.add(...weatherColors['night'].split(' '))
    }
}



// adds searched cities result under search box
searchCityInput.addEventListener('input', async function(event) {
    const city = event.target.value

    if(city == '') {
        searchCities.innerHTML = ''
        searchCities.classList.add('hidden')
        return 
    }
    

    // returns all the cities with matching name
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=20&appid=${key}`)
    const data = await response.json()
    
    searchCities.innerHTML = ''
    data.forEach(async city => {

        // to get country name from its code
        const responce = await fetch(`https://restcountries.com/v3.1/alpha/${city.country}`)
        const data = await responce.json()
        country = data[0].name.common

        let name
        if(city.state != undefined)
            name = city.name + ', ' + city.state + ', ' + country
        else    
            name = city.name + ', ' + country

        searchCities.innerHTML += 
            `
            <li class="bg-blue-440  cursor-pointer hover:bg-blue-400 rounded-[10px]" onclick="searchCurrentCity(event)">
                <div class='p-[10px]'>${name}
                    <div class="hidden">${city.lat}</div>
                    <div class="hidden">${city.lon}</div>
                </div>
            </li>
            `
    })
    searchCities.classList.remove('hidden')
})


// clears input city box when not in focus
searchCities.addEventListener('blur', function() {
    searchCities.classList.add('hidden')
    searchCityInput.value = ''
})


// updates weather from search result
function searchCurrentCity(event) {
    const lat = parseInt(event.target.children[0].innerHTML)
    const lon = parseInt(event.target.children[1].innerHTML)
    currCityLat = lat
    currCityLon = lon
    searchCities.classList.add('hidden')

    // updateWeather(lat, lon, event.target.innerText.split('\n')[0]) // updates name with state and country
    updateWeather(lat, lon, event.target.innerText.split('\n')[0].split(',')[0]) // updates only name
}


// convert utc to ist
function convertTime(timeStr) {
    let hours = parseInt(timeStr.split(':')[0])
    let minutes = parseInt(timeStr.split(':')[1])
    let carry = 0;

    if(minutes + 30 > 59) {
        carry = 1
        minutes = (minutes + 30) - 60
    }
    else {
        carry = 0
        minutes = minutes + 30
    }

    if(hours + 5 + carry > 24)
        hours = hours + carry + 5 - 24
    else 
        hours = hours + carry + 5

    hours = hours.toString()
    minutes = minutes.toString()

    if(hours.length == 1)
        hours = '0' + hours
    if(minutes.length == 1)
        minutes = '0' + minutes

    return hours.toString() + ':' + minutes.toString() + ':00'
}



// makes main temp in .right vanish when scrolled upwards
right.firstElementChild.addEventListener('scroll', ()=>{
    const blurAmount = right.firstElementChild.scrollTop / 100
    mainInfo.style.filter = `blur(${blurAmount}px)`
    mainInfo.style.transform = `scale(${Math.min(1/blurAmount, 1)})`
    mainInfo.style.opacity = `${Math.max(0, 1/blurAmount-0.3)}`
})


// manages classes when screen is resized
function dynamicScreenResize() {

    if (mobile.matches) {
        // height: 100%;
        // margin-top: -100px;
        left.classList.add('absolute')
        left.classList.remove('relative')
        
        right.classList.add('h-[100%]')

        left.classList.add('w-[100%]')
        left.classList.add('left-[-100%]')
        
        left.classList.remove('relative')
        left.classList.remove('w-[35%]')
        left.classList.remove('w-[60%]')
        left.classList.remove('w-[25%]')

        left.classList.remove('right-[0%]')
        left.classList.remove('right-[100%]')

        // adjusting grid elements
        tiles.classList.remove('grid-cols-4')
        tiles.classList.remove('grid-cols-3')
        tiles.classList.add('grid-cols-2')
        
        tempGraphTile.classList.remove('col-span-4')
        tempGraphTile.classList.remove('col-span-3')
        tempGraphTile.classList.add('col-span-2')
        
        aqiTile.classList.remove('col-span-3')
        aqiTile.classList.add('col-span-2')
        aqiTile.classList.remove('w-[640px]')
        aqiTile.classList.add('w-[420px]')
        aqiTile.children[1].classList.add('text-[10px]')

        tempGraphTile.style.order = 1;
        // aqiTile.classList.add('hidden')
        aqiTile.style.order = 2;
        weatherForecastTile.style.order = 3;
        visibilityTile.style.order = 4;
        feelsLikeTile.style.order = 5;
        windTile.style.order = 6;
        humidityTile.style.order = 7;
        pressureTile.style.order = 8;
        sunCycle.style.order = 9;

        right.firstElementChild.classList.remove('max-w-[863px]')
        right.firstElementChild.classList.remove('min-w-[863px]')
        right.firstElementChild.classList.add('max-w-[420px]')
        right.firstElementChild.classList.add('min-w-[420px]')
        right.firstElementChild.classList.remove('max-w-[650px]')
        right.firstElementChild.classList.remove('min-w-[650px]')

        // right.style.transform = 'scale(0.85)'
        tiles.classList.add('scale-75')
        tiles.classList.add('mt-[-200px]')
        saveCityButton.classList.remove('right-[0px]')
        saveCityButton.classList.add('right-[45px]')
        rightToggle.classList.remove('left-[0px]')
        rightToggle.classList.add('left-[45px]')
        currTemp.classList.remove('text-[120px]')
        currTemp.classList.add('text-[90px]')

        // managing search city expand button
        leftToggle.classList.remove('hidden')

        loadingWindow.getElementsByTagName('img')[0].classList.remove('w-[120px]')
        loadingWindow.getElementsByTagName('img')[0].classList.add('w-[80px]')

        
    }


    else if (tablet.matches) {
        left.classList.add('left-[-100%]')
        left.classList.add('absolute')
        left.classList.add('w-[60%]')
        
        left.classList.remove('relative')
        left.classList.remove('right-[0%]')
        left.classList.remove('right-[100%]')
        left.classList.remove('w-[100%]')

        right.classList.remove('h-[100%]')
        
        // adjusting grid elements
        tiles.classList.add('grid-cols-3')
        tiles.classList.remove('grid-cols-2')
        tiles.classList.remove('grid-cols-4')

        aqiTile.classList.add('col-span-3')
        aqiTile.classList.remove('col-span-2')
        aqiTile.classList.add('w-[640px]')
        aqiTile.classList.remove('w-[420px]')
        aqiTile.children[1].classList.remove('text-[10px]')
        aqiTile.classList.remove('hidden')

        tempGraphTile.classList.remove('col-span-4')
        tempGraphTile.classList.remove('col-span-2')
        tempGraphTile.classList.add('col-span-3')

        tempGraphTile.style.order = 1;
        aqiTile.style.order = 2;
        weatherForecastTile.style.order = 3;
        visibilityTile.style.order = 4;
        feelsLikeTile.style.order = 5;
        humidityTile.style.order = 6;
        windTile.style.order = 7;
        pressureTile.style.order = 8;
        sunCycle.style.order = 9;

        right.firstElementChild.classList.remove('max-w-[863px]')
        right.firstElementChild.classList.remove('min-w-[863px]')
        right.firstElementChild.classList.remove('max-w-[420px]')
        right.firstElementChild.classList.remove('min-w-[420px]')
        right.firstElementChild.classList.add('max-w-[650px]')
        right.firstElementChild.classList.add('min-w-[650px]')

        // right.style.transform = 'scale(1)'
        tiles.classList.remove('scale-75')
        tiles.classList.remove('mt-[-200px]')
        saveCityButton.classList.add('right-[0px]')
        saveCityButton.classList.remove('right-[45px]')
        rightToggle.classList.add('left-[0px]')
        rightToggle.classList.remove('left-[45px]')
        currTemp.classList.add('text-[120px]')
        currTemp.classList.remove('text-[90px]')

        // managing search city expand button
        leftToggle.classList.remove('hidden')

        loadingWindow.getElementsByTagName('img')[0].classList.add('w-[120px]')
        loadingWindow.getElementsByTagName('img')[0].classList.remove('w-[80px]')

    }
    else if (btablet.matches) {
        left.classList.remove('relative')
        left.classList.remove('w-[100%]')
        left.classList.remove('w-[60%]')
        left.classList.remove('right-[0%]')
        left.classList.remove('right-[100%]')

        left.classList.add('absolute')
        left.classList.add('w-[35%]')
        left.classList.add('left-[-100%]')

        // adjusting grid elements
        tiles.classList.remove('grid-cols-2')
        tiles.classList.remove('grid-cols-3')
        tiles.classList.add('grid-cols-4')
        
        tempGraphTile.classList.add('col-span-4')
        tempGraphTile.classList.remove('col-span-3')
        tempGraphTile.classList.remove('col-span-2')

        aqiTile.classList.add('col-span-3')
        aqiTile.classList.remove('col-span-2')
        aqiTile.classList.add('w-[640px]')
        aqiTile.classList.remove('w-[420px]')
        aqiTile.children[1].classList.remove('text-[10px]')
        aqiTile.classList.remove('hidden')

        tempGraphTile.style.order = 1;
        humidityTile.style.order = 2;
        aqiTile.style.order = 3;
        weatherForecastTile.style.order = 4;
        feelsLikeTile.style.order = 5;
        visibilityTile.style.order = 6;
        windTile.style.order = 7;
        pressureTile.style.order = 8;
        sunCycle.style.order = 9;

        right.firstElementChild.classList.add('max-w-[863px]')
        right.firstElementChild.classList.add('min-w-[863px]')
        right.firstElementChild.classList.remove('max-w-[420px]')
        right.firstElementChild.classList.remove('min-w-[420px]')
        right.firstElementChild.classList.remove('max-w-[650px]')
        right.firstElementChild.classList.remove('min-w-[650px]')

        // right.style.transform = 'scale(1)'
        tiles.classList.remove('scale-75')
        tiles.classList.remove('mt-[-200px]')
        saveCityButton.classList.add('right-[0px]')
        saveCityButton.classList.remove('right-[45px]')
        rightToggle.classList.add('left-[0px]')
        rightToggle.classList.remove('left-[45px]')
        currTemp.classList.add('text-[120px]')
        currTemp.classList.remove('text-[90px]')

        // managing search city expand button
        leftToggle.classList.remove('hidden')

        loadingWindow.getElementsByTagName('img')[0].classList.add('w-[120px]')
        loadingWindow.getElementsByTagName('img')[0].classList.remove('w-[80px]')
 
    }
    else if (desktop.matches) {
        left.classList.remove('absolute')
        left.classList.remove('left-[-100%]')
        left.classList.remove('left-[0%]')
        left.classList.remove('w-[35%]')
        left.classList.remove('w-[60%]')
        right.classList.remove('w-[100%]')
        
        left.classList.add('relative')
        left.classList.add('right-[0%]')
        left.classList.add('w-[25%]')
        right.classList.add('w-[75%]')

        // adjusting grid elements
        tiles.classList.add('grid-cols-4')
        tempGraphTile.classList.add('col-span-4')
        
        tiles.classList.remove('grid-cols-2')
        tiles.classList.remove('grid-cols-3')

        aqiTile.classList.add('w-[640px]')
        aqiTile.classList.remove('w-[420px]')
        aqiTile.classList.add('col-span-3')
        aqiTile.classList.remove('col-span-2')
        aqiTile.children[1].classList.remove('text-[10px]')
        aqiTile.classList.remove('hidden')

        tempGraphTile.classList.remove('col-span-3')
        tempGraphTile.classList.remove('col-span-2')

        tempGraphTile.style.order = 1;
        humidityTile.style.order = 2;
        aqiTile.style.order = 3;
        weatherForecastTile.style.order = 4;
        feelsLikeTile.style.order = 5;
        visibilityTile.style.order = 6;
        windTile.style.order = 7;
        pressureTile.style.order = 8;
        sunCycle.style.order = 9;

        right.firstElementChild.classList.add('max-w-[863px]')
        right.firstElementChild.classList.add('min-w-[863px]')

        right.firstElementChild.classList.remove('max-w-[420px]')
        right.firstElementChild.classList.remove('min-w-[420px]')
        right.firstElementChild.classList.remove('max-w-[650px]')
        right.firstElementChild.classList.remove('min-w-[650px]')

        // right.style.transform = 'scale(1)'
        tiles.classList.remove('scale-75')
        tiles.classList.remove('mt-[-200px]')
        saveCityButton.classList.add('right-[0px]')
        saveCityButton.classList.remove('right-[45px]')
        rightToggle.classList.add('left-[0px]')
        rightToggle.classList.remove('left-[45px]')
        currTemp.classList.add('text-[120px]')
        currTemp.classList.remove('text-[90px]')

        loadingWindow.getElementsByTagName('img')[0].classList.add('w-[120px]')
        loadingWindow.getElementsByTagName('img')[0].classList.remove('w-[80px]')

        // managing search city expand button
        leftToggle.classList.add('hidden')
    }
}



// adds functionality to expand left button
function toggleLeftMenu()
{
    if (mobile.matches) {
        left.classList.toggle('left-[0%]')
        left.classList.toggle('left-[-100%]')
    }

    else if (tablet.matches) {
        left.classList.toggle('left-[0%]')
        left.classList.toggle('left-[-100%]')
    }
    else if(btablet.matches) { 
        left.classList.toggle('left-[0%]')
        left.classList.toggle('left-[-100%]')
    }
    else if(desktop.matches) {
        left.classList.toggle('right-[0%]')
        left.classList.toggle('right-[100%]')

        left.classList.toggle('w-[25%]')
        left.classList.toggle('w-[0%]')

        right.classList.toggle('w-[75%]')
        right.classList.toggle('w-[100%]')
        
        right.firstElementChild.classList.toggle('w-[60%]')
        right.firstElementChild.classList.toggle('w-[80%]')
    }

    
}

// detect when sccreen size is changed
window.addEventListener('resize', dynamicScreenResize)
window.addEventListener('DOMContentLoaded', dynamicScreenResize)

// adds an individual city to saved tab when bookmark button is clicked
// city = [lat, lon, name]
async function updateSavedCities(city)
{
    const timeResponce = await fetch(`http://localhost:3000/time/${city[0]}/${city[1]}`)
    const timeData = await timeResponce.json()

    // const currWeatherResponce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city[0]}&lon=${city[1]}&appid=${key}&units=${units}`)
    const currWeatherResponce = await fetch(`http://localhost:3000/current-weather/${city[0]}/${city[1]}`)
    const currWeatherData = await currWeatherResponce.json()

    // saving city to db
    const res = await fetch(`http://localhost:3000/save-city`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({name: city[2], lat: currWeatherData.coord.lat, lon: currWeatherData.coord.lon})
    })
    const data = await res.json()

    // checks if city to be saved is not present in db already
    if(data == '1') {
        savedCities.innerHTML += 
            `
            <li class="relative hover:scale-[101%] transition-all duration-100 ease-linear " onclick="updateCityFromSavedCities(this) " onmouseenter="savedCitiesMouseEvent(this)" onmouseleave="savedCitiesMouseEvent(this)">
                <div class="flex justify-between items-center py-[7px] px-[15px] w-full h-full cursor-pointer" >
                    <div class="hidden">
                        <div>${currWeatherData.coord.lat}</div>
                        <div>${currWeatherData.coord.lon}</div>
                    </div>
                    <div>
                        <div class="text-[20px]">${city[2]}</div>
                        <div>${timeData.time}</div>
                        <div class="text-[13px]">${currWeatherData.weather[0].main}</div>
                    </div>
                    <div class="text-[40px]">${Math.floor(currWeatherData.main.temp)}°</div>
                </div>
                <div class="cross w-[15px] h-[15px] bg-transparent backdrop-blur-sm filter invert rounded-[10px] absolute top-[calc(50%-5px)] right-[-5px] hover:scale-110 hidden" onclick="savedCitiesCrossButtonClicked(this)">
                    <img src="../assets/icons/cross-icon.png" alt="" >
                </div>
            </li>
            <div class="break-line relative bg-[rgb(145,154,166)] h-[1px] w-full "></div>
            `
    }
}


async function retrieveSavedCities(city)
{
    const timeResponce = await fetch(`http://localhost:3000/time/${city[0]}/${city[1]}`)
    const timeData = await timeResponce.json()

    const currWeatherResponce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city[0]}&lon=${city[1]}&appid=${key}&units=${units}`)
    const currWeatherData = await currWeatherResponce.json()

    savedCities.innerHTML += 
        `
        <li class="relative hover:scale-[101%] transition-all duration-100 ease-linear "  onclick="updateCityFromSavedCities(this) " onmouseenter="savedCitiesMouseEvent(this)" onmouseleave="savedCitiesMouseEvent(this)">
            <div class="flex justify-between items-center py-[7px] px-[15px] w-full h-full cursor-pointer">
                <div class="hidden">
                    <div>${currWeatherData.coord.lat}</div>
                    <div>${currWeatherData.coord.lon}</div>
                </div>
                <div >
                    <div class="text-[20px]">${city[2]}</div>
                    <div>${timeData.time}</div>
                    <div class="text-[13px]">${currWeatherData.weather[0].main}</div>
                </div>
                <div class="text-[40px] ">18°</div>
            </div>
            <div class="cross w-[15px] h-[15px] bg-transparent backdrop-blur-sm filter invert rounded-[10px] absolute top-[calc(50%-5px)] right-[-5px] hidden" onclick="savedCitiesCrossButtonClicked(this)">
                <img src="../assets/icons/cross-icon.png" alt="" >
            </div>
        </li>
        <div class="break-line bg-[rgb(145,154,166)] h-[1px] w-full "></div>
        `
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



function updateCityFromSavedCities(element) {

    // prevents city from changing when trying to delete it
    if(event.target.tagName === 'IMG') {
        return
    }

    const lat = element.firstElementChild.firstElementChild.children[0].innerHTML
    const lon = element.firstElementChild.firstElementChild.children[1].innerHTML
    const city = element.firstElementChild.children[1].firstElementChild.innerHTML
    updateWeather(lat, lon, city)
}

// initially updates all the cities
// cities.forEach(city => {
//     savedCities.innerHTML = ''
//     updateSavedCities(city)
// })

// initially show bookmarked cities 
(async function() {
    const dbCities = await fetch('http://localhost:3000/get-all-saved-cities')
    const res = await dbCities.json()
    savedCities.innerHTML = ''
    
    for (const city of res) {
        await retrieveSavedCities([city.lat, city.lon, city.name]) // arg = [lat, lon, name]
    }
}) ()



// bookmark button (adds current city to bookmarked cities)
function saveCurrentCity() {
    // removes city from db if the button is pressed again
    if(saveCityButton.getElementsByTagName('img')[0].src.includes('bookmark-remove-icon.svg')) {
        deleteCityFromDB(currCityLat, currCityLon)
        
        // all the bookmarked cities on left
        const leftCities = Array.from(savedCities.children).filter((_, index) => index % 2 === 0)
        leftCities.forEach(city => {
            
            let lat, lon
            [lat, lon] = Array.from(city.firstElementChild.firstElementChild.children).map(e => e.innerHTML)
            
            if(lat == currCityLat && lon == currCityLon) {
                city.classList.add('hidden')
                city.nextElementSibling.classList.add('hidden')
            }
        })   

        changeBookmarkButton('add')
    }
    // adds city to left and db if not alredy present
    else {
        const c = cityName.innerHTML.split(',')[0]
        let name = ''
    
        c.split(' ').forEach(e => {
            if(name != '')
                name += ' '
            name += e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
        })
        const k = [currCityLat, currCityLon, name]
        updateSavedCities(k)
        changeBookmarkButton('remove')
    }
}


function aqiComponentStr(component, value)
{
    return `
        <div class="flex justify-between items-center w-full">
            <div class="w-[6px] h-[6px] bg-white rounded-[50%]"></div>
            <div class="w-1/2 text-left pl-[10px]">${component}: </div>
            <div class="w-1/2 text-left ">${value}nt</div>
        </div>
    `
}

// decides weather to hide pop text or not based on pop data
// if pop is 0 then dont show text, else show the text
function hidePOPText(pop) {
    if(pop >= 0 && pop <= 10)
        return "hidden"
    else 
        return ""
}

// update weather forecast tile
function updateForecast(forecast)
{
    forecastUl.innerHTML = ""
    let first = 0 // to eliminate current day from forcast
    forecast.forEach(e => {
        if(first == 0)
            first = 1
        else
        {
            const ringPos = Math.min(97, Math.floor((e[2]-e[0])/(e[1]-e[0]) * 100) - 7) // -7 because we are applying position to left of right and not the center
            forecastUl.innerHTML += 
            `<li class="flex gap-x-[10px] items-center justify-between  px-[20px] h-[60px] ">
                <div class="text-left w-[10%]">${daysOfWeek[e[3]]}</div>
                <div class="flex items-center justify-center gap-x-[35px] w-[90%]">
                    <div class="flex flex-col justify-center items-center  ">
                        <img class="w-[34px]" src="https://openweathermap.org/img/wn/${e[4]}@2x.png" alt="">
                        <div class="text-[14px] text-sky-600 ${hidePOPText(e[5])} mt-[-10px] ">${e[5]}%</div>
                    </div>
                    <div class="w-[30px] text-right ">${e[0]}°</div>
                    <div class="bg-gradient-to-r from-yellow-200 to-orange-600 w-[120px] h-[8px] rounded-[10px] relative">
                        <div class="w-[16px] h-[16px] rounded-[50%] bg-white absolute top-[-4px] border-black border-2" onmouseenter="toggleWeatherForcastRing(event)" onmouseleave="toggleWeatherForcastRing(event)" style="left: ${ringPos}%;">
                            <div id="weather-forcast-ring" class="tile absolute w-[0px] text-[0px] top-[100%] left-[0%] text-center  transition-all ease-in-out duration-200">Avg temp ${e[2]}°</div>
                        </div>
                    </div>
                    <div class="w-[30px] text-left ">${e[1]}°</div>
                </div>
            </li>
            <div class="w-full flex justify-center items-center">
                <div class="break-line bg-[rgb(145,154,166)] h-[1px] w-[95%]"></div>
            </div>
            `
        }
    });
    

}



function timezoneNameToEpoch(timezoneName) {
    let currentDate = new Date().toLocaleString("en-US", {timeZone: timezoneName})
    let epochTime = new Date(currentDate).getTime() / 1000
    return epochTime;
}


function changeBookmarkButton(action) {
    if(action == 'add') {
        saveCityButton.getElementsByTagName('img')[0].src = '../assets/icons/bookmark-add-icon.svg'
        saveCityButton.children[1].innerHTML = 'Add Bookmark'
    }
    else if(action == 'remove'){
        saveCityButton.getElementsByTagName('img')[0].src = '../assets/icons/bookmark-remove-icon.svg'
        saveCityButton.children[1].innerHTML = 'Remove Bookmark'
    }
}

function removePreWeatherVisuals() {
    snowContainer.innerHTML = ''
    rainContainer.innerHTML = ''
    starsContainer.innerHTML = ''
    mistContainer.innerHTML = ''
    cloudContainer.innerHTML = ''
}


function getDayOfWeek(epoch) {
    const date = new Date(epoch*1000) // must be in miliseconds
    return date.getDay()
}


async function fetchWeatherForecastData(lat, lon, timeZone) {
    const responce = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`)
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
            // converts night icon to day icon
            const newIcon = preData.weather[0].icon.replace('n', 'd')
            fiveDayForcast.push([Math.floor(min), Math.ceil(max), Math.floor(avg/count)-1, getDayOfWeek(tempData.dt), newIcon, Math.floor(pop*100/count)])
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

    return ({hours: hours, hourlyTemp: hourlyTemp, fiveDayForcast: fiveDayForcast})
}


async function updateWeather(lat, lon, city)
{
    loadingWindow.classList.remove('hidden')
    loadingWindow.getElementsByTagName('img')[0].classList.add('loading-animation')

    try {
        const currentWeatherResponce = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`)
        const currentWeatherData = await currentWeatherResponce.json()
    
        const timeResponce = await fetch(`http://localhost:3000/time/${lat}/${lon}`)
        const timeData = await timeResponce.json()
    
        const weatherForecastData = await fetchWeatherForecastData(lat, lon, timeData.timeZone)
    
        const aqiResponce = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`)
        const aqiData = await aqiResponce.json()
    
        currCityLat = currentWeatherData.coord.lat
        currCityLon = currentWeatherData.coord.lon
    
        // changeing button if city is present in db
        const dbRes = await fetch('http://localhost:3000/city-present', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({lat: currCityLat, lon: currCityLon})
        }) 
        const dbData = await dbRes.json()
        if(dbData == '1')
            changeBookmarkButton('remove')
        else
            changeBookmarkButton('add')
    
        // weather visuals (rain, clear, foggy, snow)
        let bgIcon = currentWeatherData.weather[0].icon
    
        // updating main info
        const currTempReading = Math.floor(currentWeatherData.main.temp)
        cityName.innerHTML = city.toUpperCase()
        currTemp.innerHTML = currTempReading
        currWeather.innerHTML = currentWeatherData.weather[0].main
        mainInfo.children[1].innerHTML = timeData.dayOfWeek + ', ' + months[timeData.month-1] + ' ' + timeData.day
        mainWeatherIcon.src = `https://openweathermap.org/img/wn/${bgIcon}@2x.png`
        mainTime.innerHTML = timeData.time
    
        // updating tiles
        // aqi tile
        const ind =  aqiData.list[0].main.aqi
        aqiReading.innerHTML = ind
        aqiMessage.innerHTML = aqiMessageText[ind]
        aqiContents1.innerHTML =
            aqiComponentStr('CO', aqiData.list[0].components.co) +
            aqiComponentStr('NO', aqiData.list[0].components.no) +
            aqiComponentStr('NO2', aqiData.list[0].components.no2) +
            aqiComponentStr('O3', aqiData.list[0].components.o3)
        aqiContents2.innerHTML =
            aqiComponentStr('SO2', aqiData.list[0].components.so2) +
            aqiComponentStr('PM2.5', aqiData.list[0].components.pm2_5) +
            aqiComponentStr('PM10', aqiData.list[0].components.pm10) +
            aqiComponentStr('NH3', aqiData.list[0].components.nh3)
        aqiRing.style.left = Math.min(ind/5*100, 96) + '%'
    
    
        // humidity tile
        const humidity = currentWeatherData.main.humidity
        humidityReading.innerHTML = humidity + '%'
        if(humidity < 40)
            humidityMessage.innerHTML = 'Low Moisture Content'
        else if(humidity >= 40 && humidity < 60)
            humidityMessage.innerHTML = 'Medium Moisture Content'
        else    
            humidityMessage.innerHTML = 'High Moisture Content'
    
        // rain and snow data
        if(currentWeatherData.rain == undefined)
            rainReading.innerHTML = 'Rain: 0mm in last 1hr'
        else
            rainReading.innerHTML = `Rain: ${currentWeatherData.rain['1h']}mm in last 1hr`
    
        if(currentWeatherData.snow == undefined)
            snowReading.innerHTML = 'Snow: 0mm in last 1hr'
        else 
            snowReading.innerHTML = `Snow: ${currentWeatherData.snow['1h']}mm in last 1hr`
        
    
    
        // feels like temp tile
        const feelsLikeTempReading = Math.floor(currentWeatherData.main.feels_like)
        feelsLikeReading.innerHTML = feelsLikeTempReading + '°C'
        feelsLikeMinReading.innerHTML = 'Minimum Temperature: ' + Math.floor(currentWeatherData.main.temp_min) + '°'
        feelsLikeMaxReading.innerHTML = 'Maximum Temperature: ' + Math.ceil(currentWeatherData.main.temp_max) + '°'
        if(currTempReading == feelsLikeTempReading)
            feelsLikeMessage.innerHTML = 'Feels Like Reported'
        else if(feelsLikeTempReading > currTempReading)
            feelsLikeMessage.innerHTML = `Feels ${feelsLikeTempReading-currTempReading}° Warmer`
        else
            feelsLikeMessage.innerHTML = `Feels ${currTempReading-feelsLikeTempReading}° Colder`
    
    
        // wind tile
        windReading.innerHTML = currentWeatherData.wind.speed + 'kmh'
        needle.style.transform = `rotate(${currentWeatherData.wind.deg}deg)`
        gusts.innerHTML = 'Gust: ' + currentWeatherData.wind.gust + 'kmh'
    
        // visibility tile
        const range = currentWeatherData.visibility/1000
        visibilityReading.innerHTML = range + 'km'
        if(range < 7)
            visibilityMessage.innerHTML = 'Bad Visibility'
        else if(range >= 7 && range < 15)
            visibilityMessage.innerHTML = 'Good Visibility'
        else    
            visibilityMessage.innerHTML = 'Excellent Visibility'
    
        // pressure tile
        pressureBar.style = `transform:rotate(${currentWeatherData.main.pressure/100}deg)`
    
        // sun cycle tile
        const sunriseTime = convertEpochToHumanReadable(currentWeatherData.sys.sunrise, timeData.timeZone).split(' ')[1].slice(0, 5)
        const sunsetTime = convertEpochToHumanReadable(currentWeatherData.sys.sunset, timeData.timeZone).split(' ')[1].slice(0, 5)
        sunrise.innerHTML = sunriseTime 
        sunset.innerHTML = sunsetTime 
    
        // updating bg-color of page
        changeBackgroundColorByTime(parseInt(timeData.time.split(':')[0]), parseInt(sunriseTime.split(':')[0]), parseInt(sunsetTime.split(':')[0]))
    
        // updating forcast
        updateForecast(weatherForecastData.fiveDayForcast)
    
        // creating chart
        createChart("tempGraph", weatherForecastData.hours, weatherForecastData.hourlyTemp, graphPointColor, graphTextColor, graphPointColor, city)
    
    
        
        // bgIcon = '10n'
        removePreWeatherVisuals() // removes weather visuals from previous cities and makes the canvas clean
        
        // HEAVY RAIN DAY
        if(bgIcon == '10d') {
            removeBackgroundColors()
            screenBox.classList.add(...weatherColors['night-rain'].split(' '))
            rainVisual(window.innerWidth * 0.08)
        }
        // LIGHT RAIN DAY
        else if(bgIcon == '09d') {
            removeBackgroundColors()
            screenBox.classList.add(...weatherColors['night-rain'].split(' '))
            rainVisual(window.innerWidth * 0.03)
        }
        // LIGHT RAIN NIGHT
        else if(bgIcon == '09n') {
            rainVisual(window.innerWidth * 0.03)
        }
        // HEAVY RAIN NIGHT
        else if(bgIcon == '10n') {
            rainVisual(window.innerWidth * 0.03)
        }
        // SNOW
        else if(bgIcon.includes('13')) {
            snowVisuals(window.innerWidth * 0.01)
        }
        // STARS
        else if(bgIcon == '01n') {
            starsVisual(window.innerWidth * 0.2)
        }
        // MIST
        else if(bgIcon.includes('50')) {
            mistVisual()
        }
        // CLOUDS DAY
        else if(bgIcon == '02d') {
            cloudsVisual(5, 150, 350, 120, 130)
        }
        // CLOUDS DAY
        else if(bgIcon == '03d' || bgIcon == '04d') {
            cloudsVisual(4, 200, 600, 200, 400)
        }
        // CLOUDS NIGHT
        else if(bgIcon == '02n') {
            cloudsVisual(5, 150, 350, 120, 130, 'night')
            starsVisual(window.innerWidth * 0.02)
        }
        // CLOUDS NIGHT
        else if(bgIcon == '03n' || bgIcon == '04n') {
            cloudsVisual(4, 200, 600, 200, 400, 'night')
            starsVisual(window.innerWidth * 0.01)
        }
    
    
    
        loadingWindow.classList.add('hidden')
        loadingWindow.getElementsByTagName('img')[0].classList.remove('loading-animation')

    }
    catch {
        // alert('An erro occured. Please refresh the page.')
    }

}


async function createChart(canvasId, xValues, yValues, graphPointColor, graphTextColor, graphAxisColor, city) {

    return new Chart(canvasId, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: graphPointColor, // for points
                pointRadius: 5,
                borderColor: graphTextColor, // for lines
                data: yValues,
                fill: true,
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        color: graphAxisColor // Change color of x-axis grid lines
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: graphAxisColor // Change color of y-axis grid lines
                    }
                }]
            },
            title: {
                display: true,
                plugins: {
                    colors: {
                        enabled: true
                    }
                }
            },
            legend: {
                display: false
            }
        }
    })
}


function toggleWeatherForcastRing(event) {
    const ele = event.target.firstElementChild
    ele.classList.toggle('w-[0px]')
    ele.classList.toggle('w-[90px]')
    ele.classList.toggle('text-[0px]')
    ele.classList.toggle('text-[10px]')
    ele.classList.toggle('left-[0%]')
    ele.classList.toggle('left-[-320%]')
    ele.classList.toggle('p-[8px]')
}

function toggleBookmarkText(event) {
    const ele = event.target.nextElementSibling
    ele.classList.toggle('text-[0px]')
    ele.classList.toggle('text-[10px]')
    ele.classList.toggle('p-[8px]')
}

// shows cross button when hovered over any bookmarked city
function savedCitiesMouseEvent(ele) {
    // ele.nextElementSibling.classList.toggle('hidden')
    ele.getElementsByClassName('cross')[0].classList.toggle('hidden')
}

function deleteCityFromDB(lat, lon) {
    fetch('http://localhost:3000/delete-city', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({lat: lat, lon: lon})
    })
}

function savedCitiesCrossButtonClicked(ele) {


    const main = ele.previousElementSibling
    const bottomBrLine = ele.parentNode.nextElementSibling
    const infoChild = main.children[0]

    const lat = infoChild.children[0].innerHTML
    const lon = infoChild.children[1].innerHTML

    // removeing city from db
    deleteCityFromDB(lat, lon)

    // removing elements from DOM
    main.remove()
    bottomBrLine.remove()

    // updating save button if current city and the removed cities are same
    if(lat == currCityLat && lon == currCityLon) {
        changeBookmarkButton('add')
    }
}
