const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const request = require('request')


const veiwsFolder = path.join(__dirname, '../templates/views')
app.set('views',veiwsFolder)

const partialsFolder = path.join(__dirname, '../templates/partials')
hbs.registerPartials(partialsFolder)

app.set('view engine','hbs')
const newPathToPublicFolder = path.join(__dirname,'../public/')

app.use(express.static(newPathToPublicFolder))
console.log(newPathToPublicFolder)



// app.get('/',(req,res)=>{
//     res.send('<h1>Welcom to the Express World</h1>')
// })


app.get('/',(req,res)=>{
    console.log(req.query)
    // if(!req.query.createdby){
    //     return res.send("Created by name is not provided")
    // }
    res.render('index',{
        title:"this is aboout Page",
        createdBy: req.query.createdby
    })
})


app.get('/helloworld', (req, res) => {
    
    res.send({
        name:"Maaz",
        message:'Hello World',
        class:'Node/Express/mongo'
    })
})

app.get('/about', (req, res) => {
    console.log(req.query)
    res.render('about')
})

app.get('/search', (req, res) => {
    const { word } = req.query
    if (!word) { return res.send({ error: "word not provided!" }) }
    const options = {
        url: 'https://od-api.oxforddictionaries.com:443/api/v2/entries/en-gb/' + word,
        headers: {
            "Accept": "application/json",
            "app_id": "a8e1104f",
            "app_key": "4a122c1abf684ec4447dad5c0f90c2ea"
        },
        json: true
    }
    const callback = (error, response) => {
     //   console.log("error :", error)
      //  console.log("Status Code: ", response && response.statusCode)
        const definition = (response) && (response.statusCode === 200)
            ? response.body.results[0].lexicalEntries[0].entries[0].senses[0].definitions.toString()
            : "Sorry word not found in dicitionary"
        const data = {
            word,
            error,
            definition
        }

        return res.send({ data, })

    }
    request(options, callback)
})

app.get('*', (req, res) => {
    res.send('No page')
})

// The changes while uploading over heroku 
// first change put the key 'start' in script  in package.json
//second here use port and default port 
//then we use the same method git to deploy over 

const port = process.env.PORT || 3000

app.listen(port,()=>{
    console.log(`Listening to port ${port} done!!`)
})