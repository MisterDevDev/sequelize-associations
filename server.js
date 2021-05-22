const express = require('express')
const { syncAndSeed, models: {Department, Employee} } = require('./db')

const app = express()

app.get('/api/departments', async(req, res, next) => {
    try{
        res.send(await Department.findAll( 
                {
                    include: 
                    {
                    model: Employee,
                    as: 'manager'
                    },
                }
        ))
    } catch(err) {
        next(err)
    }
})

app.get('/api/employees', async(req, res, next) => {
    try{
        res.send(await Employee.findAll({
            include: [
                {
                    model: Employee,
                    as: 'supervisor'
                },
                Employee,
                Department
            ]
                }));
    } catch(err) {
        next(err)
    }
})

const init = async() => {
    try{
        await syncAndSeed()
        console.log(`DB sync and seed operation successful`)

        const Port = 1337;
        app.listen(Port, () => console.log(`Server listening on Port: ${Port}`))
    } catch (err) {
        console.log(err);
    }
}

init();