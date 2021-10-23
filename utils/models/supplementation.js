const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Class = require("./class");
const Group = require("./group");
const Room = require("./room");
const Subject = require("./subject");
const Teacher = require("./teacher");

const Supplementation = sequelize.define(
    "supplementations",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        class: {
            type: DataTypes.CHAR(2),
            references: {
                model: Class,
                key: "id"
            }
        },
        type: {
            type: DataTypes.ENUM,
            values: ["substitutes", "move-src", "move-target", "join"]
        },
        hour: {
            type: DataTypes.TINYINT
        },
        subject: {
            type: DataTypes.CHAR(3),
            references: {
                model: Subject,
                key: "id"
            }
        },
        group: {
            type: DataTypes.STRING(16),
            references: {
                model: Group,
                key: "id"
            }
        },
        room: {
            type: DataTypes.INTEGER,
            references: {
                model: Room,
                key: "id"
            } 
        },
        teacher: {
            type: DataTypes.STRING(16),
            references: {
                model: Teacher,
                key: "abbrev"
            }
        },
        notes: {
            type: DataTypes.STRING(255)
        }
    }
);

module.exports = Supplementation;