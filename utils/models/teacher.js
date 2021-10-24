const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Teacher = sequelize.define(
    "teacher",
    {
        id: {
            type: DataTypes.STRING(16),
            primaryKey: true
        },
        abbrev: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING
        },
        komise: {
            type: DataTypes.STRING
        }
    }, {
        indexes: [{
            fields: ["abbrev"],
            type: "UNIQUE"
        }]
    }
);

module.exports = Teacher;