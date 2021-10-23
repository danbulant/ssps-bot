const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("prestiz", config.user, config.password, {
    host: config.host,
    dialect: "mariadb",
    define: {
        freezeTableName: true
    }
});

module.exports = sequelize;

require("./models/class");
require("./models/student");
require("./models/room");
require("./models/group");
require("./models/teacher");
require("./models/subject");
require("./models/timetable");
require("./models/rickroll");
require("./models/supplementation");

sequelize.sync();