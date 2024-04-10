// const k = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         const randInt = Math.random()
//         if(randInt >= 0.5)
//             resolve('True')
//         else
//             reject('Error')
//     }, 1000);
// })

// k.then(l => {
//     console.log(l)
// }).catch(e => {
//     console.log(e)
// })


function func() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const randInt = Math.random()
            if(randInt >= 0.5)
                resolve('True')
            else
                reject('Error')
        }, 1000);
    })
}

console.log(func())

// func().then(l => {
//         console.log(l)
//     }).catch(e => {
//         console.log(e)
//     })