const express = require('express')
const Profiles = require('../models/profiles')
const auth = require('../middlewares/auth')
const routes = express.Router()
const multer = require('multer')
const jimp = require('jimp')
const {sendWelcomeEmail, sendGoodByEmail} = require('../emails/profiles')
const UploadImage = multer({
    limits: {
        fileSize: 1000000 // for not over 1MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please Upload a jpg, jpeg and png file"))
        }
        cb(undefined, true) // true is for carry on with file upload and false is for cancel file upload
    }
})




routes.post('/profiles/uploadFile',auth,UploadImage.single('avatar'),async (req, res)=>{
    // req.profile.avatar = req.file.buffer
    // await req.profile.save()
    try{
        const jimpImage = await jimp.read(req.file.buffer)
       // console.log(jimpImage)
        const rImage = await jimpImage.resize(250, 250, jimp.MIME_PNG)
        const buffer = await rImage.getBufferAsync(jimp.MIME_JPEG)
        req.profile.avatar = buffer
        await req.profile.save()
        res.send()
    }catch(e){
        console.log(e)
        res.status(400).send({ error: e.message })
    }
},(error, req, res, next) => {
    res.status(400).send({error: error.message})
})

routes.post('/profiles', async (req, res) => {
    try{
       
        const profile = await Profiles(req.body).save()
        
        const token = await profile.generateAuthToken()

         sendWelcomeEmail(profile.name, profile.email)

        res.send({profile, token})
    }catch(e){
        console.log(e)
        res.status(400)
        res.send(e)
    }
  

})


routes.delete('/profiles/myavatar', auth, async (req, res) => {
    req.profile.avatar = undefined
    await req.profile.save()
    res.send()
})

routes.get('/profiles/myprofile/avatar', auth, async(req, res) => {
    try{
        const profile = req.profile
        if(!profile.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'Image/png')
        res.send(profile.avatar)
    }catch(e){
        res.status(404).send()
    }
})

routes.get('/profiles',async(req,res) => {
try {
   const profiles = await Profiles.find({})
    if (!profiles) {
        res.status(404)
    }
    //const publicDataProfiles = Profiles.sendPublicDataOnly(profiles)
   res.send(profiles)
}catch(e){
    console.log(e)
    res.status(500)
    res.send(e)    
}

})

routes.get('/profiles/myprofile',auth,async (req,res)=>{
    // const id = req.params.id
    try{
    //const profile = await Profiles.findById(id)
    
    const profile = req.profile
     await profile.populate('wishList').execPopulate()


   //     console.log(profile._id.toString(), ' ', id)  
    // if (profile._id.toString() !== id ) {
    //         res.status(404).send({})
    //     }
        res.send(profile)
    }
    catch(e){
       // console.log(e)
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
      //  console.log(changedProfile)
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
    //await req.profile.populate('wishList').execPopulate()
    await req.profile.remove()
    sendGoodByEmail(req.profile.name, req.profile.email)
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
        //const publicData = profile.sendPublicDataOnly()
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