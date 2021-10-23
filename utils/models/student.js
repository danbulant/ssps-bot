const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Class = require("./class");

const Student = sequelize.define(
    "students",
    {
        id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            allowNull: false
        },
        class: {
            type: DataTypes.CHAR(2),
            allowNull: false,
            references: {
                model: Class,
                key: "id"
            }
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        born: {
            type: DataTypes.DATEONLY
        },
        discord: {
            type: DataTypes.BIGINT
        },
        flags: {
            type: DataTypes.INTEGER
        }
    }
);

module.exports = Student;