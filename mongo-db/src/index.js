require('./db/mongoose')

const Profiles = require('./models/profiles')

const newRec = Profiles({
    name:"Maaz",
    age:10,
    graduate:true,
    email:'maaznadeem246ail.com'
})


newRec.save()
.then(data => console.log(data))
.catch(err => console.log(err))