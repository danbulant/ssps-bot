const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Room = sequelize.define(
    "room",
    {
        id: {
            type: DataTypes.STRING(8),
            primaryKey: true
        }
    }
);

module.exports = Room;