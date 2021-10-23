const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Supplementation = sequelize.define(
    "supplementation",
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
        type: {
            type: DataTypes.ENUM,
            values: ["substitutes", "move-src", "move-target", "join"]
        },
        hour: {
            type: DataTypes.TINYINT
        },
        notes: {
            type: DataTypes.STRING(255)
        }
    }
);

module.exports = Supplementation;