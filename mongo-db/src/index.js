const express = require('express')
require('./db/mongoose')
const profileRoutes = require('./routers/profile-routes')
const wishlistRoutes = require('./routers/wishlist-routes')

// for functions
// mongoose api driver
// node api driver 

// const newRec = Profiles({
//     name:"Maaz",
//     age:10,
//     graduate:true,
//     email:'maaznadeem246@gmail.com'
// })


// newRec.save()
// .then(data => console.log(data))
// .catch(err => console.log(err))

const app = express()

const port = process.env.PORT || 3000

// app.use((req,res,next)=>{
//     res.send("sorry site is under maintainence !! ,try again later")
// })

app.use(express.json())
app.use(profileRoutes)
app.use(wishlistRoutes)

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

