const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Subject = sequelize.define(
    "subjects",
    {
        id: {
            type: DataTypes.CHAR(3),
            primaryKey: true
        },
        abbrev: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING
        }
    }, {
        indexes: [{
            fields: ["abbrev"],
            type: "UNIQUE"
        }]
    }
);

module.exports = Subject;