const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Event = require("./event");
const Group = require("./group");

const EventGroup = sequelize.define(
    "event_group",
    {
        event: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Event,
                key: "id"
            }
        },
        group: {
            type: DataTypes.STRING(16),
            allowNull: false,
            references: {
                model: Group,
                key: "id"
            }
        },
        relation: {
            type: DataTypes.STRING
        }
    },
    {
        indexes: [{
            fields: ["event", "group"],
            type: "UNIQUE"
        }]
    }
);

module.exports = EventGroup;