const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const Rickroll = sequelize.define(
    "rickroll",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        link: {
            type: DataTypes.STRING(255),
            defaultValue: "'https://www.youtube.com/watch?v=dQw4w9WgXcQ'"
        }
    }
);

module.exports = Rickroll;