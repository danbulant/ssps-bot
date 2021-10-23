const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Group = require("./group");
const Student = require("./student");

const GroupStudent = sequelize.define(
    "group_student",
    {
        group: {
            type: DataTypes.STRING(16),
            allowNull: false,
            references: {
                model: Group,
                key: "id"
            }
        },
        student: {
            type: DataTypes.STRING(45),
            allowNull: false,
            references: {
                model: Student,
                key: "id"
            }
        }
    },
    {
        indexes: [{
            fields: ["group", "student"],
            type: "UNIQUE"
        }]
    }
);

module.exports = GroupStudent;