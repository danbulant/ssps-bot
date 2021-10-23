const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Event = sequelize.define(
    "event",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.fn("CURRENT_TIMESTAMP"),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM,
            values: ["test", "homework", "action"]
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        }
    }
);

module.exports = Event;