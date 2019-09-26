const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
var jwt = require('jsonwebtoken');
const WishList = require('./wishlist')

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
    }],
    avatar:{
        type:Buffer
    }
},{ 
    toObject: { virtuals: true },
    timestamps:true
})

profileSchema.virtual('wishList',{
    ref:'WishList',
    localField:'_id',
    foreignField: 'wishedBy'
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

profileSchema.pre('remove', async function (next) {
    const profile = this
    await WishList.deleteMany({
        wishedBy:profile._id
    })
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
    const token = jwt.sign({ _id: profile._id.toString() }, process.env.JWT_SECRET)
    profile.tokens = profile.tokens.concat({token:token})
    await profile.save()
    return token
}


// we can use to toJSON function 
// profileSchema.methods.toJSON , profileSchema.statics.toJSON
// which overriddes its built-in function and do our functionality
profileSchema.methods.toJSON = function () {
    const profile = this
    const publicProfileData = profile.toObject()

    delete publicProfileData.password
    delete publicProfileData.tokens
    delete publicProfileData.avatar

    //console.log(publicProfileData)
    return publicProfileData
}

profileSchema.statics.toJSON = function (records) {
    const profiles = records
    const publicProfileFields = profiles.map((p => {
        const obj = p.toObject()
        delete obj.password
        delete obj.tokens
        delete obj.avatar
        return obj
    }))
    return publicProfileFields
}

    

const Profiles = mongoose.model('Profiles', profileSchema)

module.exports = Profiles