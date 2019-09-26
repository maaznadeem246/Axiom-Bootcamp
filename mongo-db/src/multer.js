const express = require('express')

const app = express()
const port = 3000

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploadsFolder')
    },
    filename: (req, file, cb) => {
        const fileNameSplit = file.originalname.split('.')
        const fileExtension = fileNameSplit[fileNameSplit.length - 1]
        cb(null, Date.now() + '-'+ Math.ceil(Math.random() * 1000) + '.' + fileExtension)
    }
})

const fileUpload = multer({

    storage,
    limits:{
        fileSize:1000000 // for not over 1MB
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please Upload a jpg, jpeg and png file"))
        }
        cb(undefined, true) // true is for carry on with file upload and false is for cancel file upload
    }
})

app.post('/fileuploads',fileUpload.single('fileUpload'), (req, res)=>{
    res.send()
},(error, req, res, next)=>{
    res.status(400).send({error:error.message})
})


app.use(express.json())
app.listen(port, ()=>{
    console.log('Server is running at ',port)
})