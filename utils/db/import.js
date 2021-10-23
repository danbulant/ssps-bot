const isMain = require.main === module;
if(isMain) {
    const yaml = require("js-yaml");
    const fs = require("fs-extra");
    const config = yaml.load(fs.readFileSync("./config.yml", { encoding: "utf-8" }));
    global.config = config;
}

const sequelize = require("../sequelize");
const api = require("../api");
const server = require("../ssps-server");
const Class = require("../models/class");
const Group = require("../models/group");
const Subject = require("../models/subject");
const Teacher = require("../models/teacher");
const Room = require("../models/room");
const Timetable = require("../models/timetable");

sequelize.afterBulkSync(async () => {
    console.log("Sync in progress");

    if(isMain) {
        console.log("Syncing timetable");
        const classes = Object.values(api.map);
        await Promise.all(classes.map(async id => {
            const name = api.demap[id];
            await Class.create({
                id,
                year: (2021 - parseInt(name[0]-1)),
                type: name[1],
                discord: server.reverseRoles[name]
            }).catch(console.error);
            const timetable = await api.getSchedule(id);
            for(const day in timetable.schedule) {
                for(let hour in timetable.schedule[day]) {
                    let lessons = timetable.schedule[day][hour];
                    if(!Array.isArray(lessons)) lessons = [lessons];
                    for(const item of lessons) {
                        await Group.create({
                            id: item.Group.Id,
                            abbrev: item.Group.Abbrev,
                            name: item.Group.Name,
                            class: id
                        }).catch(console.error);
                        await Subject.create({
                            id: item.Subject.Id,
                            abrev: item.Subject.Abbrev,
                            name: item.Subject.Name
                        }).catch(console.error);
                        await Teacher.create({
                            id: item.Teacher.Id,
                            abbrev: item.Teacher.Abbrev,
                            name: item.Teacher.Name
                        });
                        await Room.create({ id: item.Room.Abbrev });
                        const cycle = item.Cycles[0].Id === "1" && item.Cycles[1].Id === "2" ? "always" : item.Cycles[0].Id === "1" ? "even" : item.Cycles[0].Id === "2" ? "odd" : null;
                        await Timetable.create({
                            day,
                            hour,
                            class: id,
                            group: item.Group.Id,
                            subject: item.Subject.Id,
                            teacher: item.Teacher.Id,
                            room: item.Room.Abbrev,
                            cycles: cycle
                        });
                        console.log("Done", day, hour, item.Subject.Id);
                    }
                }
            }
        }));
        console.log("Sync done");
    }
});