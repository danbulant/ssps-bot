const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Room = sequelize.define(
    "rooms",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }
    }
);

module.exports = Room;