const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

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
        cycles: {
            type: DataTypes.ENUM,
            values: ["always", "odd", "even"]
        }
    }
);

module.exports = Timetable;