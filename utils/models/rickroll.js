const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Student = require("./student");

const Rickroll = sequelize.define(
    "rickrolls",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        source: {
            type: DataTypes.STRING(45),
            allowNull: false,
            references: {
                key: "id",
                model: Student
            }
        },
        target: {
            type: DataTypes.STRING(45),
            allowNull: false,
            references: {
                key: "id",
                model: Student
            }
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: "CURRENT_TIMESTAMP()"
        },
        link: {
            type: DataTypes.STRING(255),
            defaultValue: "'https://www.youtube.com/watch?v=dQw4w9WgXcQ'"
        }
    }
);
EventGroup.belongsTo(Student, { as: "source" });
EventGroup.belongsTo(Student, { as: "target" });

module.exports = Rickroll;