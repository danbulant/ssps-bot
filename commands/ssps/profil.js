const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed, APIMessage } = require("discord.js");
const { DateTime } = require("luxon");
const Person = require("../../utils/models/person");
const api = require("../../utils/api");

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
        if(person.avatar) embed.setThumbnail(person.avatar);
        embed.setDescription(person.about);
        if(person.birthday) embed.addField("Narozeniny", DateTime.fromFormat(person.birthday, "yyyy-MM-dd").toFormat("dd. MM. yyyy"));
        embed.addField("Email", person.mail);
        embed.addField("Typ", api.isTeacherMail(person.mail) ? "Učitel" : api.isStudentMail(person.mail) ? "Student" : "Neprestižní");

        return msg.say(embed);
    }
};