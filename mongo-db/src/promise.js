
const addNumber = (a, b) => {
    const fail = Math.floor(Math.random() * 4) === 3
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(!fail){
                res(a+b)
            }else{
                rej("Reject")
            }
        }, 2000);
    })
}

// addNumber(2, 4)
// .then((result1) => {
//     console.log(result1)
//     addNumber(4, result1)
//     .then((result2) => {
//         console.log(result2)
//     }).catch(e => console.log(e))
// }).catch(e => console.log(e))


// // this called promise chaining 

// addNumber(5, 5)
// .then(result1 => {
//     console.log(result1)
//     return addNumber(4, result1)
// })
// .then(result2 =>{
//     console.log(result2)
//     return addNumber(result2, 2)
// })
// .catch(e => console.log(e))
// const sum = async (a, b) => {
//     const result1  = await addNumber(a, b)
//     const result2 = await addNumber(result1 , 5)
//     const result3 = await addNumber(result2 , 10)

//     return result3
// }

// sum(2, 2).then(result => console.log(result)).catch(e => console.log(e))


require('./db/mongoose')

 const Profiles = require('./models/profiles')

// Profiles.findByIdAndUpdate('5d7baeb88c232e05541a149e',{
//     graduate:true
// })
// .then(res => {
//     console.log(res)
//     return Profiles.countDocuments({
//         graduate:true
//     })
// })
// .then(count => {
//     console.log(count)
// })
// .catch(e => console.log(e))



const updateAndCount = async (id,criteria) =>{
   try{
    const res = await Profiles.findByIdAndUpdate(id,criteria)
    if(!res){
        throw new Error("Profile no Found")
    }
    const count = await Profiles.countDocuments(criteria)
    console.log(res , count)
   }
   catch(e){
        console.log(e);
   }
}

updateAndCount('5d7baeb88c232e15541a149e',{graduate:true})