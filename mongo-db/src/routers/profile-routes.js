const express = require('express')
const Profiles = require('../models/profiles')

const routes = express.Router()

routes.post('/profiles', async (req, res) => {
    try{
        const profile = await Profiles(req.body).save()
        res.send(profile)
    }catch(e){
        res.status(400)
        res.send(e)
    }
  

})

routes.get('/profiles',async(req,res) => {
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

routes.get('/profiles/:id',async (req,res)=>{
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

routes.patch('/profiles/:id', async (req, res) => {
    const changedProfile = req.body
    const fieldsToUpdate = Object.keys(req.body)
    const fieldsInModel = ['name','age','graduate','email','password']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    if(!isUpdateAllowed){

        return res.status(400).send({error: 'Invalid feilds!'})
    }

    try{
       // const profile = await Profiles.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true} )
       const profile = await Profiles.findById(req.params.id)
       if(!profile){
            return res.status(404).send()
        }
        const pro =  Object.assign(profile,changedProfile)
        await profile.save()
        console.log(changedProfile)
        res.send(profile)
        
    }catch(e){

        res.status(400).send(e)
    }
})

routes.delete('/profiles/:id', async (req,res) => {
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

module.exports = routes