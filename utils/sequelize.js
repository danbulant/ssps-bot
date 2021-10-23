const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("prestiz", global.config.mysql.user, global.config.mysql.password, {
    host: global.config.mysql.host,
    dialect: "mariadb",
    logging: false
});

module.exports = sequelize;

const Class = require("./models/class");
const Person = require("./models/person");
const Student = require("./models/student");
const Room = require("./models/room");
const Group = require("./models/group");
const Teacher = require("./models/teacher");
const Subject = require("./models/subject");
const Timetable = require("./models/timetable");
const Rickroll = require("./models/rickroll");
const Supplementation = require("./models/supplementation");
const Event = require("./models/event");
const EventStudent = require("./models/event_student");
const EventGroup = require("./models/event_group");
const GroupStudent = require("./models/group_student");

Supplementation.belongsTo(Class);
Supplementation.belongsTo(Subject);
Supplementation.belongsTo(Group);
Supplementation.belongsTo(Room);
Supplementation.belongsTo(Teacher);

Rickroll.belongsTo(Person, { as: "source" });
Rickroll.belongsTo(Person, { as: "target" });

Student.belongsTo(Class);
Group.belongsTo(Class);

Student.belongsToMany(Event, { through: EventStudent });
Event.belongsToMany(Student, { through: EventStudent });
Group.belongsToMany(Event, { through: EventGroup });
Event.belongsToMany(Group, { through: EventGroup });

Group.belongsToMany(Student, { through: GroupStudent });
Student.belongsToMany(Group, { through: GroupStudent });

Timetable.belongsTo(Class);
Timetable.belongsTo(Group);
Timetable.belongsTo(Subject);
Timetable.belongsTo(Teacher);
Timetable.belongsTo(Room);

Person.hasOne(Student);
Person.hasOne(Teacher);

sequelize.sync({ force: global.config.mysql.forceUpdate });