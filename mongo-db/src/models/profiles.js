const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
var jwt = require('jsonwebtoken');


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
        unique: true,
        required:true,
        lowercase:true,
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
    },
    tokens:[{
        token:{
           type: String,
            required:true
        }
    }]
})




profileSchema.pre('save',async function(next){
     const profile = this
     if(profile.isModified('password')){
       //  console.log(profile.password, " pre password")
     profile.password = await bcryptjs.hash(profile.password,8)
        // console.log(profile.password, " Hashed password")
     }

     next()
})


profileSchema.statics.findByCredentials = async (email, password) => {
    const profile = await Profiles.findOne({email})
    if(!profile){
        throw new Error('Unable to Login')
    }
    
    const isMatch = await bcryptjs.compare(password,profile.password)
    
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return profile
}

profileSchema.methods.generateAuthToken = async function(){
    const profile = this
    const token = jwt.sign({_id:profile._id.toString()}, 'thisIsMySecretKey')
    profile.tokens = profile.tokens.concat({token:token})
    await profile.save()
    return token
}
    

const Profiles = mongoose.model('Profiles', profileSchema)

module.exports = Profiles