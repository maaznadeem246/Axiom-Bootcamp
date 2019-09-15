const express = require('express')
require('./db/mongoose')
const Profiles = require('./models/profiles')

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
app.use(express.json())

app.post('/profiles', async (req, res) => {
    try{
        const profile = await Profiles(req.body).save()
        res.send(profile)
    }catch(e){
        res.status(400)
        res.send(e)
    }
  

})

app.get('/profiles',async(req,res) => {
try {
   const profile = await Profiles.find({})
    if (!profile) {
        res.status(404)
    }
   res.send(profile)
}catch(e){
    res.status(500)
    res.send(e)    
}

})

app.get('/profiles/:id',async (req,res)=>{
    const id = req.params.id
    try{
    const profile = await Profiles.findById(id)
        if (!profile) {
            res.status(404)
        }
        res.send(profile)
    }
    catch(e){
        res.status(500).send(e)
    }

})

app.patch('/profiles/:id', async (req, res) => {
    const fieldsToUpdate = Object.keys(req.body)
    const fieldsInModel = ['name','age','graduate','email']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    if(!isUpdateAllowed){
        return res.status(400).send({error: 'Invalid feilds!'})
    }

    try{
        const profile = await Profiles.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true} )
        if(!profile){
            return res.status(404).send()
        }
        res.send(profile)
    }catch(e){
        res.status(400).send(e)
    }
})

app.delete('/profiles/:id', async (req,res) => {
    try{
    const profile = await Profiles.findByIdAndDelete(req.params.id)
    if(!profile){
        res.status(404)
    }

    res.send(profile)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

