const { Sequelize, Op, Model, DataTypes } = require("sequelize");
const sequelize = require("../sequelize");
const Event = require("./event");
const Group = require("./group");

const EventGroup = sequelize.define(
    "event_groups",
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
        }
    },
    {
        indexes: [{
            fields: ["event", "group"],
            type: "UNIQUE"
        }]
    }
);
EventGroup.belongsTo(Event, { as: "event" });
EventGroup.belongsTo(Group, { as: "group" });

module.exports = EventGroup;