const { UUIDV4 } = require('sequelize');
const Sequelize = require('sequelize');

const dbAddress = 'postgres://localhost:5432/acme_corp'
const db = new Sequelize(dbAddress, {logging:false});

const Department = db.define('department', {
    name: {
        type: Sequelize.DataTypes.STRING(20)
    }
});

const Employee = db.define('employee', {
    id: {
        type:Sequelize.DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: Sequelize.DataTypes.STRING(20)
    }
});

Department.belongsTo(Employee, {as: 'manager'});
Employee.hasMany(Department, {foreignKey: 'managerId'});

Employee.belongsTo(Employee, {as: 'supervisor'});
Employee.hasMany(Employee, {foreignKey: 'supervisorId'})

const syncAndSeed = async() => {
    try{
    await db.sync({ force: true });
    console.log(`DB sync and seed operation successful`)

        const [lucy, moe, larry, hr, engineering] = await Promise.all([
            Employee.create({name: 'lucy'}),
            Employee.create({name: 'moe'}),
            Employee.create({name: 'larry'}),
            Department.create({name: 'hr'}),
            Department.create({name: 'engineering'})
        ])
        hr.managerId = lucy.id;
        larry.supervisorId = lucy.id;
        moe.supervisorId = lucy.id;


        await Promise.all(
            hr.save(),
            moe.save(),
            larry.save()
        )
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    syncAndSeed,
    models: {
        Department,
        Employee
    }
}