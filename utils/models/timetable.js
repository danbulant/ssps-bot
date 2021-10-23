const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Class = require("./class");
const Group = require("./group");
const Room = require("./room");
const Subject = require("./subject");
const Teacher = require("./teacher");

const Timetable = sequelize.define(
    "timetable",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        day: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        hour: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        class: {
            type: DataTypes.CHAR(2),
            references: {
                model: Class,
                key: "id"
            },
            allowNull: false
        },
        group: {
            type: DataTypes.STRING(16),
            references: {
                model: Group,
                key: "id"
            },
            allowNull: false
        },
        subject: {
            type: DataTypes.CHAR(3),
            references: {
                model: Subject,
                key: "id"
            },
            allowNull: false
        },
        teacher: {
            type: DataTypes.STRING(16),
            references: {
                model: Teacher,
                key: "id"
            },
            allowNull: false
        },
        room: {
            type: DataTypes.INTEGER,
            references: {
                models: Room,
                key: "id"
            },
            allowNull: false
        },
        cycles: {
            type: DataTypes.ENUM,
            values: ["always", "odd", "even"]
        }
    }
);

module.exports = Timetable;