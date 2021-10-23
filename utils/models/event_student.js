const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Event = require("./event");
const Student = require("./student");

const EventStudent = sequelize.define(
    "event_student",
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
        },
        relation: {
            type: DataTypes.STRING
        }
    },
    {
        indexes: [{
            fields: ["event", "student"],
            type: "UNIQUE"
        }]
    }
);

module.exports = EventStudent;