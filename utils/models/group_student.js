const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Group = require("./group");
const Student = require("./student");

const GroupStudent = sequelize.define(
    "group_student",
    {
    },
    {
        indexes: [{
            fields: ["groupId", "studentId"],
            type: "UNIQUE"
        }]
    }
);

module.exports = GroupStudent;