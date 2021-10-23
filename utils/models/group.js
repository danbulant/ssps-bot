const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Class = require("./class");

const Group = sequelize.define(
    "groups",
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
        class: {
            type: DataTypes.CHAR(2),
            references: {
                model: Class,
                key: "id"
            }
        }
    }
);
Group.belongsTo(Class, { as: "class" });

module.exports = Group;