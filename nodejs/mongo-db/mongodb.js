const { MongoClient, ObjectId} = require("mongodb")


const url = "mongodb://127.0.0.1:27017"
const databaseName = "mydb"

MongoClient.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
},(error,client)=>{
    if(error){
      return  console.log("Error connecting database!")
    }
    console.log("database Connected")
    const db = client.db(databaseName)
    // we use insertone for inserting one 
    // db.collection('profiles').insertOne({
    //     name:"Maaz",
    //     email:"maaznadeem246@gmail.com"
    // })
    
    //this is use for insert many data
    // const newId = ObjectId()
    // db.collection('profiles').insertMany([{
    //     _id:newId,
    //     name:"hassan",
    //     email:"hassan246@gmail.com"
    // }, {   
    //      _id: newId,
    //     name: "hassan",
    //     email: "hassan246@gmail.com"
    //     }],(error,response)=>{
    //     if(error){
    //         return console.log("error adding document")
    //     }
    //     else{
    //         console.log(response.ops)
    //     }
    // })

    // for find many
    // db.collection('profiles').find({
    //     email:"maaznadeem246@gmail.com"
    // }).toArray((error,arrayData)=>{
    //     // if(error){
    //         return console.log(arrayData) 
    //    // }
    // })

    db.collection('profiles').updateMany(
        {email:'maaznadeem246@gmail.com'},
        {
            $set:{
                name:"Muhammad Maaz",
                age:38
            }
            ,
            // $inc:{
            //     age: 38
            // }
        }
        ).then((data)=>{
            console.log(data)
        }).catch((err)=>{
            console.log("Error updating document")
        })

  client.close()
}) 