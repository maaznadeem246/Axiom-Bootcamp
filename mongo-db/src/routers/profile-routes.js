const express = require('express')
const Profiles = require('../models/profiles')
const auth = require('../middlewares/auth')
const routes = express.Router()

routes.post('/profiles', async (req, res) => {
    try{
       
        const profile = await Profiles(req.body).save()
        
        const token = await profile.generateAuthToken()
        
        res.send({profile, token})
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

routes.get('/profiles/myprofile',auth,async (req,res)=>{
    // const id = req.params.id
    try{
    //const profile = await Profiles.findById(id)
      const profile = req.profile
   //     console.log(profile._id.toString(), ' ', id)  
    // if (profile._id.toString() !== id ) {
    //         res.status(404).send({})
    //     }
        res.send(profile)
    }
    catch(e){
        res.status(500).send(e)
    }

})

routes.patch('/profiles/myprofile', auth, async (req, res) => {
    const changedProfile = req.body
    const fieldsToUpdate = Object.keys(req.body)
    const fieldsInModel = ['name','age','graduate','email','password']
    const isUpdateAllowed = fieldsToUpdate.every((field) => fieldsInModel.includes(field))
    if(!isUpdateAllowed){

        return res.status(400).send({error: 'Invalid feilds!'})
    }

    try{
       // const profile = await Profiles.findByIdAndUpdate(req.params.id, req.body, {new:true,runValidators:true} )
    //    const profile = await Profiles.findById(req.params.id)
    //    if(!profile){
    //         return res.status(404).send()
    //     }
        profile = req.profile
         Object.assign(profile,changedProfile)
        await profile.save()
        console.log(changedProfile)
        res.send(profile)
        
    }catch(e){

        res.status(400).send(e)
    }
})

routes.delete('/profiles/myprofile',auth, async (req,res) => {
    try{
    // const profile = await Profiles.findByIdAndDelete(req.params.id)
    // if(!profile){
    //     res.status(404)
    // }

    await req.profile.remove()
    res.send(req.profile)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

routes.post('/profiles/login',async(req, res) => {
    try{
        const profile = await Profiles.findByCredentials(req.body.email, req.body.password)
        const token = await profile.generateAuthToken()

        res.send({profile, token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

routes.post('/profiles/logout', auth, async(req, res) => {
    try{
        const {profile, token} = req
        profile.tokens = profile.tokens.filter((t)=> t.token !== token)
        await profile.save()
        res.send()
    }catch(e){
        res.status(400).send()
    }
})



module.exports = routes