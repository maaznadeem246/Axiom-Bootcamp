const fs = require('fs')
const chalk = require('chalk')
const _ = require('lodash')
const addTask = (title, description) => {
    const data = loadData()

    const isDuplicate = chkDuplicate(title, data)

    if (isDuplicate) {
        console.log('Task is already in database')
    } else {
        const newTask = {
            title,
            description
        }
        const tmpData = [...data, newTask]
        saveToDatabase(tmpData)
        console.log(`Todo task with title "${title}" added in to database`)
        listTask()
    }
}
const saveToDatabase = (dataToAdd) => {

    const jsonData = JSON.stringify(dataToAdd)
    fs.writeFileSync("data.txt", jsonData)


}

const chkDuplicate = (title, data) => {
    const dataFound = data.filter(d => d.title === title)
    return (dataFound.length === 0) ? false : true
}

const loadData = () => {
    try {
        const rawData = fs.readFileSync("data.txt")
        const parsedData = JSON.parse(rawData)
        return parsedData
    } catch (e) {
        return []
    }

}

const listTask = () => {
    const data = loadData()
    if (!data.length === 0) {
        console.log(chalk.inverse.bold("No Task to list!"))
    }
    data.map(d => {
        console.log(chalk.white.bgBlue.bold(d.title))
        console.log(chalk.blue("  " + d.description))
    })
}


const deleteTask = (title) => {
    const rawData = loadData()
    const dub = chkDuplicate(title, rawData)
    if (rawData.length != 0) {
        if (dub) {
            const newData = rawData.filter(d => d.title !== title)
            console.log(`Your "${title}" task has been deleted !`)
            console.log('Here is your Latest Task List')
            saveToDatabase(newData)
            listTask()
        } else {
            console.log(`Their is not any task "${title}" !`)
        }
    } else {
        console.log("Your Task List is Empty !")
    }
}

const updateTask = (title, description) => {
    const rawData = loadData()
    const dub = chkDuplicate(title, rawData)
    if (rawData.length != 0) {
        //        console.log(rawData.title[title])
        if (dub) {
            const newData = rawData.map(o => {
                if (o.title == title) {
                    o.description = description
                    return o
                } else {
                    return o
                }
            })
            saveToDatabase(newData)
            console.log(`Your task ${title} has been updated !`)
            console.log('Here is your Updated List !')
            listTask()
        } else {
            console.log(`Their is not any task  "${title}" ! `)
        }
    } else {
        console.log("Your Task List is Empty !")
    }
}


module.exports = {
    addTask,
    listTask,
    deleteTask,
    updateTask
}
