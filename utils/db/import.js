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
const Person = require("../models/person");
const Student = require("../models/student");
const { Op } = require("sequelize");

function catcher(err) {
    if(err.original && err.original.text.startsWith("Duplicate entry")) return null;
    throw err;
}

function contextErrors(data) {
    return (err) => {
        try {
            catcher(err);
        } catch(e) {
            console.warn(data);
            throw e;
        }
    }
}

sequelize.afterBulkSync(async () => {
    if(!isMain) return;
    console.log("Sync in progress");

    if(process.argv.includes("--timetable")) {
        console.log("Syncing timetable");
        const classes = Object.values(api.map);
        await Promise.all(classes.map(async id => {
            const name = api.demap[id];
            await Class.create({
                id,
                year: (2021 - parseInt(name[0]-1)),
                type: name[1],
                discord: server.reverseRoles[name]
            }).catch(contextErrors(name));
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
                            classId: id
                        }).catch(contextErrors(item));
                        await Subject.create({
                            id: item.Subject.Id,
                            abbrev: item.Subject.Abbrev,
                            name: item.Subject.Name
                        }).catch(contextErrors(item));
                        await Person.create({
                            name: item.Teacher.Name,
                            mail: api.buildTeacherMail(item.Teacher.Name),
                            flags: 1
                        }).catch(contextErrors(item));
                        const person = await Person.findOne({ where: { mail: api.buildTeacherMail(item.Teacher.Name) } });
                        await Teacher.create({
                            id: item.Teacher.Id,
                            abbrev: item.Teacher.Abbrev,
                            name: item.Teacher.Name,
                            personId: person.id
                        }).catch(contextErrors(item));
                        if(item.Room.Abbrev) await Room.create({ id: item.Room.Abbrev }).catch(contextErrors(item));
                        const cycle = item.Cycles.length > 1 && item.Cycles[0].Id === "1" && item.Cycles[1].Id === "2" ? "always" : item.Cycles[0].Id === "1" ? "even" : item.Cycles[0].Id === "2" ? "odd" : null;
                        await Timetable.create({
                            day,
                            hour,
                            classId: id,
                            groupId: item.Group.Id,
                            subjectId: item.Subject.Id,
                            teacherId: item.Teacher.Id,
                            roomId: item.Room.Abbrev || null,
                            cycles: cycle
                        }).catch(contextErrors(item));
                        console.log("Done", day, hour, item.Subject.Id);
                    }
                }
            }
        }));
        console.log("Timetables synced")
    }
    if(process.argv.includes("--profesni-sit")) {
        /**
         * V tuhle chvíly je poslední existující ID 414 (@2021-10-23)
         * get-users vrací jen prvních 50. Snažím se zjistit jak se dostat dál...
         */
        console.log("Syncing profesni sit");
        for await(const user of api.profesniSit.getUsers()) {
            if(!user.email) continue;
            if(!user.email.endsWith("ssps.cz")) continue;
            if(user.email.endsWith("@skola.ssps.cz")) user.email = user.email.replace("@skola.ssps.cz", "@ssps.cz");
            console.log(user.email);
            var person = await Person.findOne({
                where: {
                    [Op.or]: {
                        mail: user.email,
                        name: `${user.firstName} ${user.lastName}`
                    }
                }
            });
            if(!person) person = Person.build({ mail: user.email, flags: 1 });
            if(user.about) person.about = user.about;
            if(user.birthday) person.birthday = new Date(user.birthday);
            person.name = `${user.firstName} ${user.lastName}`;
            if(user.imagePath) person.avatar = "https://profesnisit.ssps.cz/" + user.imagePath;
            await person.save();

            if(api.isStudentMail(user.email)) {
                if(!user.class) continue;
                user.class = user.class.replace(/ |\./g, "").toUpperCase();
                var student = await Student.findOne({
                    where: {
                        personId: person.id
                    }
                });
                if(!student) {
                    await Student.create({
                        id: user.email.split("@")[0],
                        classId: api.map[user.class],
                        personId: person.id,
                        name: person.name
                    });
                } else {
                    student.name = person.name;
                    await student.save();
                }
            } else if(api.isTeacherMail(user.email)) {
                // synced by timetables
            }
        }
        console.log("Profesni sit synced");
    }
    console.log("Sync done");
});