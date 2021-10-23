const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Person = sequelize.define(
    "person",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        mail: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING
        },
        about: {
            type: DataTypes.STRING(512)
        },
        birthday: {
            type: DataTypes.DATEONLY
        },
        discord: {
            type: DataTypes.BIGINT
        },
        flags: {
            type: DataTypes.INTEGER
        }
    }, {
        indexes: [{
            fields: ["mail"],
            type: "UNIQUE"
        }]
    }
);

module.exports = Person;