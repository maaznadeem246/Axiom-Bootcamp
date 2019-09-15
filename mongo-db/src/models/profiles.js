const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

// const Profiles = mongoose.model('Profiles',{
//     name:{
//         type:String,

//     },
//     age:{
//         type:Number,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must be positive number')
//             }
//         }

//     },
//     graduate:{
//         type:Boolean,
//         default:false
//     },
//     email:{
//         type:String,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is invalid")
//             }
//         }
//     },
//     passowrd:{
//         type:String,
//         required:true,
//         minlength:7,
//         trim:true,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password cannot contain "passowrd"')
//             }
//         }
//     }

// })

const profileSchema = mongoose.Schema({
        name:{
        type:String,

    },
    age:{
        type:Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be positive number')
            }
        }

    },
    graduate:{
        type:Boolean,
        default:false
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    }
})




profileSchema.pre('save',async function(next){
     const profile = this
    console.log("in save")
     if(profile.isModified('password')){
         console.log(profile.password, " pre password")
     profile.password = await bcryptjs.hash(profile.password,8)
         console.log(profile.password, " Hashed password")
     }

     next()
})

const Profiles = mongoose.model('Profiles', profileSchema)

module.exports = Profiles