const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed, APIMessage } = require("discord.js");
const { DateTime } = require("luxon");
const Person = require("../../utils/models/person");
const api = require("../../utils/api");
const Teacher = require("../../utils/models/teacher");
const Student = require("../../utils/models/student");
const sequelize = require("../../utils/sequelize");
const Subject = require("../../utils/models/subject");

module.exports = class profil extends commando.Command {
    constructor(client) {
        super(client, {
            name: "profil",
            memberName: "profil",
            group: "ssps",
            description: "Zobrazí profil uživatele",
            args: [{
                key: "user",
                type: "user",
                default: msg => msg.author,
                prompt: "Čí profil zobrazit?"
            }]
        });
    }

    async run(msg, { user }) {
        const embed = new MessageEmbed();
        const person = await Person.findOne({
            where: { discord: user.id }
        });
        if(!person) {
            embed.setColor("RED");
            embed.setTitle("Uživatel nenalezen.");
            embed.setDescription("Discord účet není propojený s účtem školním.");
            return msg.say(embed);
        }
        embed.setTitle(person.name);
        embed.setThumbnail(person.avatar || user.displayAvatarURL());
        if(person.about) embed.setDescription(person.about);
        if(person.birthday) embed.addField("Narozeniny", DateTime.fromFormat(person.birthday, "yyyy-MM-dd").toFormat("dd. MM. yyyy"));
        embed.addField("Email", person.mail, true);
        embed.addField("Typ", person.type === "teacher" ? "Učitel" : person.type === "student" ? "Student" : "Neprestižní", true);
        if(person.discord) embed.addField("Discord", "<@" + person.discord + ">", true)
        if(person.type === "teacher") {
            const teacher = await Teacher.findOne({
                where: { personId: person.id }
            });
            embed.addField("Zkratka", teacher.abbrev, true);
            if(teacher.roomId) embed.addField("Místnost", teacher.roomId, true);
            if(teacher.komise) embed.addField("Komise", teacher.komise, true);
            const subjects = await Subject.findAll({
                where: sequelize.where(sequelize.literal("(SELECT 1 FROM prestiz.timetables WHERE subjectId=subject.id AND teacherId = $teacher LIMIT 1)"), 1),
                attributes: ["abbrev"],
                bind: {
                    teacher: teacher.id
                }
            });
            embed.addField("Učí", subjects.map(t => t.abbrev).join(", ") || "Neučí žádné předměty");
        } else if(person.type === "student") {
            const student = await Student.findOne({
                where: { personId: person.id }
            });
            embed.addField("Třída", api.demap[student.class]);
        }

        return msg.say(embed);
    }
};