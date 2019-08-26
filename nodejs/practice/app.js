
const validator = require('validator')
const printMsg = require('./msg')
const chalk = require('chalk')
const yargs = require('yargs')
const fs = require('fs')

let msg = printMsg()

//console.log(msg)

const myEmail = "maaznadeem246@gmailcom"

//console.log(validator.isEmail(myEmail))


//console.log(chalk.bgBlue.bold("HI There again and angain"))


yargs.command({
    command:'delete',
    describe:'Delete Record ... ',
    builder:{
        title:{
            describe:'title to detete',
            alias:'t',
            demandOption:false,
            type:'string',
            //default:'...',
        },
        username: {
            describe: 'UserName to detete',
            alias: 'unn',
            demandOption: true,
            type: 'string',
            default:'Zia Khan',
        }
    },
    handler:(argv) => {
        console.log("Deleting record  title",argv.title)
        console.log("Deleting record  username", argv.username)
    }

})

yargs.parse()

const myObj = {
    name:'Amir Pinger',
    city:"khi",
    Country:"Pakistan",
    class:"NodeJS",
}

const newConvertedObj = JSON.stringify(myObj)
//console.log(myObj)
//console.log(newConvertedObj);

//fs.writeFileSync("data.text",newConvertedObj)
//fs.appendFileSync("data.text", newConvertedObj)
try{
    const dataRecvd = fs.readFileSync("data.text")

    const parsedData = JSON.parse(dataRecvd)

    console.log(dataRecvd.toString());
    console.log(parsedData);

}
catch(e){
    console.log("Error Occured ", e.message)
}



//console.log(yargs.argv.username)

