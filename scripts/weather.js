const starsContainer = document.querySelector('.stars')
const snowContainer = document.querySelector('.snow')
const rainContainer = document.querySelector('.rain')
const mistContainer = document.querySelector('.mist')
const cloudContainer = document.querySelector('.clouds')

function starsVisual(starsCount) {

    // adding stars
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div')
        star.classList.add('star')
    
        const x = Math.random() * screen.width
        const y = Math.random() * screen.height
        const duration = 5 + Math.random() * 5
        const delay = Math.random() * 5
    
        star.style.left = x + 'px'
        star.style.top = y + 'px'
        star.style.animationDuration = duration + 's'
        star.style.animationDelay = delay + 's'
    
        starsContainer.appendChild(star)
    }
}


function snowVisuals(snowflakesCount) {

    // adding snowflakes
    for (let i = 0; i < snowflakesCount; i++) {
        const snowflake = document.createElement('div')
        snowflake.classList.add('snowflake')
        
        const x = Math.random() * screen.width
        const len = 7 + Math.random() * 6
        const duration = 10 + Math.random() * 10
        
        const delay = Math.random() * 15
        
        snowflake.style.left = x + 'px'
        snowflake.style.width = len + 'px'
        snowflake.style.height = len + 'px'
        snowflake.style.animationDuration = duration + 's'
        snowflake.style.animationDelay = delay + 's'
        
        snowContainer.appendChild(snowflake)
        
    }
}
    
function rainVisual(dropsCount) {

    // adding stars
    for (let i = 0; i < dropsCount; i++) {
        const drop = document.createElement('div')
        drop.classList.add('drop')
        
        const x = Math.random() * screen.width
        const duration = 0.5 + Math.random() * 0.5
        
        const delay = Math.random() * 3
        
        drop.style.left = x + 'px'
        
        drop.style.animationDuration = duration + 's'
        drop.style.animationDelay = delay + 's'
        
        rainContainer.appendChild(drop)
    }
}


function mistVisual() {
    mistContainer.innerHTML = '<div class="w-full h-full bg-[#787878c4]"></div>'
}


/*
<div class="cloud top-[-200px] left-[200px] w-[900px] h-[300px] ">
    <div class="cloud-layer" id="cloud-back"></div>
    <div class="cloud-layer" id="cloud-mid"></div>
    <div class="cloud-layer" id="cloud-front"></div>
</div>
*/

function cloudsVisual(coludsCount, minWidth, maxWidth, minHeight, maxHeight, time='day') {

    // initial clouds
    for (let i = 0; i < Math.max(2, coludsCount/2); i++) {

        const cloud = document.createElement('div')

        const backLayer = document.createElement('div')
        backLayer.setAttribute('id', 'cloud-back')
        cloud.appendChild(backLayer)
        backLayer.classList.add('cloud-layer')

        const midLayer = document.createElement('div')
        midLayer.setAttribute('id', 'cloud-mid')
        cloud.appendChild(midLayer)
        midLayer.classList.add('cloud-layer')

        const frontLayer = document.createElement('div')
        frontLayer.setAttribute('id', 'cloud-front')
        cloud.appendChild(frontLayer)
        frontLayer.classList.add('cloud-layer')

        cloud.classList.add('cloud')
        
        let width = Math.max(minWidth, Math.random() * maxWidth)
        let height = Math.max(minHeight, Math.random() * maxHeight)

        if(height > width) {
            [height, width] = [width, height]
        }

        const top = 50 + Math.random() * 300

        let duration = 30 + Math.random() * 80
        let delay = 0
        // duration = 2

        cloud.style.left = screen.width * Math.random() + 'px'
        cloud.style.animationDuration = duration + 's'
        cloud.style.animationDelay = delay + 's'
        cloud.style.animationName = 'initial-cloud-movement'
        cloud.style.animationIterationCount = 1
        cloud.style.width = width + 'px'
        cloud.style.height = height + 'px'
        cloud.style.top = `-${top}px`

        cloud.addEventListener('animationend', e=> {
            cloud.remove()
        })
        
        if(time == 'night') {
            frontLayer.style.boxShadow = '300px 370px 60px -100px rgba(10, 10, 10, 0.509)'
            midLayer.style.boxShadow = 'box-shadow: 300px 340px 70px -60px rgba(70, 70, 70, 0.5)'
            backLayer.style.boxShadow = '300px 300px 30px -20px rgba(100, 100, 100, 0.5)'
        }
        
        cloudContainer.appendChild(cloud)        
    }


    // moving clouds
    for (let i = 0; i < coludsCount; i++) {

        const cloud = document.createElement('div')

        const backLayer = document.createElement('div')
        backLayer.setAttribute('id', 'cloud-back')
        cloud.appendChild(backLayer)
        backLayer.classList.add('cloud-layer')

        const midLayer = document.createElement('div')
        midLayer.setAttribute('id', 'cloud-mid')
        cloud.appendChild(midLayer)
        midLayer.classList.add('cloud-layer')

        const frontLayer = document.createElement('div')
        frontLayer.setAttribute('id', 'cloud-front')
        cloud.appendChild(frontLayer)
        frontLayer.classList.add('cloud-layer')

        cloud.classList.add('cloud')
        
        let width = Math.max(minWidth, Math.random() * maxWidth)
        let height = Math.max(minHeight, Math.random() * maxHeight)

        if(height > width) {
            [height, width] = [width, height]
        }

        const top = 50 + Math.random() * 300

        let duration = 30 + Math.random() * 80
        let delay = Math.random() * 3
        // duration = 2
        // delay = 0
        // const k = screen.width * Math.random()
        // cloud.style.left = screen.width + width + 'px'
        cloud.style.left = screen.width + width + 'px'


        cloud.style.animationDuration = duration + 's'
        cloud.style.animationDelay = delay + 's'

        cloud.style.width = width + 'px'
        cloud.style.height = height + 'px'
        cloud.style.top = `-${top}px`

        if(time == 'night') {
            frontLayer.style.boxShadow = '300px 370px 60px -100px rgba(10, 10, 10, 0.509)'
            midLayer.style.boxShadow = 'box-shadow: 300px 340px 70px -60px rgba(70, 70, 70, 0.5)'
            backLayer.style.boxShadow = '300px 300px 30px -20px rgba(100, 100, 100, 0.5)'
        }
        
        cloudContainer.appendChild(cloud)        
    }
}
// medium sized clouds
// cloudsVisual(4, 200, 600, 200, 400)

// small clouds (in background)
// cloudsVisual(5, 150, 350, 120, 130)

// cloudsVisual(4, 200, 600, 200, 400, 'night')
// starsVisual(window.innerWidth * 0.02)

