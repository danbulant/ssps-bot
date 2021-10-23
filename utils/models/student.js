const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Student = sequelize.define(
    "student",
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
        indexes: [{
            fields: ["personId"],
            type: "UNIQUE"
        }]
    }
);

module.exports = Student;