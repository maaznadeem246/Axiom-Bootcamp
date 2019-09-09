const yargs = require('yargs')
const { addTask, listTask, deleteTask, updateTask} =  require('./todo')

debugger

yargs.command({
    command: 'add',
    describe: 'Add Todo Task to file ...',
    builder: {
        title: {
            describe: 'Title for todo task',
            alias: 't',
            demandOption: true,
            type: 'string',

        },
        description: {
            describe: 'Description for the task',
            alias: 'd',
            demandOption: true,
            type: 'string',
        }
    },
    handler: ({title,description}) => {
        addTask(title,description)
    }

})


yargs.command({
    command: 'delete',
    describe: 'Delete Todo Task to file ...',
    builder: {
        title: {
            describe: 'Title for todo task',
            alias: 't',
            demandOption: true,
            type: 'string',

        },
    },
    handler: ({title}) => {
        deleteTask(title)
    }

})



yargs.command({
    command: 'list',
    describe: 'Add Todo Task to file ...',

    handler: () => {
        listTask()
    }

})

yargs.command({
    command:'update',
    describe:'Update Todo Task to file ...',
    builder: {
        title: {
            describe: 'Title for Update todo task',
            alias: 't',
            demandOption: true,
            type: 'string',
        },
        description: {
            describe: 'Description for Update todo task',
            alias: 'd',
            demandOption: true,
            type: 'string',
        },
    },
    handler:({title,description})=>{
        updateTask(title,description)
    }
})



yargs.parse()   
