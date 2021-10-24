const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const { demap, map } = require("../api");
const sequelize = require("../sequelize");
const ssps = require("../ssps-server");
const Group = require("./group");

class Student extends Model {
    /** @type {string} */
    id;
    /** @type {string} */
    name;
    /** @type {string} */
    classId;

    async setClassID(classId) {
        if(this.classId === classId) return;
        this.classId = classId;
        await this.save({ fields: "classId"});
        const [groups, mainGroup] = await Promise.all([
            this.getGroups(),
            Group.findOne({
                where: {
                    abbrev: "celá",
                    classId
                }
            })
        ]);
        await Promise.all([
            this.removeGroups(groups), 
            this.addGroup(mainGroup)
        ]);
    }

    /**
     * Updates discord class
     */
    async syncClass() {
        const person = await this.getPerson();
        if(!person || person.discord) return false;
        const user = await global.client.users.fetch(person.discord);
        const member = global.client.servers.resolve(ssps.server).member(user);
        if(!member) return false;
        await Promise.all([
            member.roles.add(ssps.reverseRoles[map[classId]]),
            member.roles.remove(Object.keys(ssps.roles).filter(t => t !== map[classId]))
        ]);
        return true;
    }
}

Student.init(
    {
        id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "student",
        indexes: [{
            fields: ["personId"],
            type: "UNIQUE"
        }]
    }
);

module.exports = Student;