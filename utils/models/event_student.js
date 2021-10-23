const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Event = require("./event");
const Student = require("./student");

const EventStudent = sequelize.define(
    "event_students",
    {
        event: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Event,
                key: "id"
            }
        },
        student: {
            type: DataTypes.STRING(45),
            allowNull: false,
            references: {
                model: Student,
                key: "id"
            }
        }
    },
    {
        indexes: [{
            fields: ["event", "student"],
            type: "UNIQUE"
        }]
    }
);
EventStudent.belongsTo(Event, { as: "event" });
EventStudent.belongsTo(Student, { as: "student" });

module.exports = EventStudent;