const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { DateTime } = require("luxon");
const api = require("../../utils/api");


module.exports = class suplovani extends commando.Command {
    constructor(client) {
        super(client, {
            name: "suplovani",
            memberName: "suplovani",
            group: "ssps",
            description: "Zobrazí stav suplování",
            args: []
        });
    }

    async run(msg) {
        let date = DateTime.now();
        if(date.hour > 16) date = date.plus({ days: 1 }); // show tomorrow supplementations after 4PM
        const supplementations = await api.getSupplementations(date);
        
        const embed = new MessageEmbed();
        embed.setTitle(`Suplování pro den ${date.day}. ${date.month}.`);

        for(const change of supplementations.data.ChangesForClasses) {
            const changes = new Map;
            for(const t of change.CancelledLessons) {
                if(!changes.has(t.Hour)) changes.set(t.Hour, []);
                changes.set(t.Hour, [...changes.get(t.Hour), `(\`${t.Subject}\`) **${t.ChgType1}** ${t.Group ? "pro " + t.Group : ""}`]);
            }
            for(const t of change.ChangedLessons) {
                if(!changes.has(t.Hour)) changes.set(t.Hour, []);
                changes.set(t.Hour, [...changes.get(t.Hour), `(\`${t.Subject}\`) **${t.ChgType1}** ${t.Group ? "(sk. " + t.Group + ")" : ""} ${t.Room ? "v `" + api.formatRoom(t.Room) + "`" : ""}`]);
            }
            embed.addField(change.Class.Abbrev,
                [...changes.entries()].map(t => `**${t[0]}**. h.: ${t[1].map(t => t.trim()).join("; ")}`) || "Žádná změna",
                true
            );
        }

        return msg.say(embed);
    }
};