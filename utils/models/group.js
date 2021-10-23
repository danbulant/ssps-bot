const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Group = sequelize.define(
    "group",
    {
        id: {
            type: DataTypes.STRING(16),
            primaryKey: true
        },
        abbrev: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        discord: {
            type: DataTypes.STRING
        }
    }
);

module.exports = Group;