const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Class = sequelize.define(
    "classes",
    {
        id: {
            type: DataTypes.CHAR(2),
            allowNull: false,
            primaryKey: true
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ["A", "B", "C", "K", "G", "L"]
        },
        discord: {
            type: DataTypes.STRING
        },
        displayName: {
            type: "CHAR(2) GENERATED ALWAYS AS concat(`year` - year(curdate()) + 1,`type`) STORED",
            set() {
                throw new Error('displayName is read-only')
            }
        }
    }
);

module.exports = Class;