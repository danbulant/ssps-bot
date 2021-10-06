const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { DateTime } = require("luxon");
const api = require("../../utils/api");

module.exports = class rozvrh extends commando.Command {
    constructor(client) {
        super(client, {
            name: "rozvrh",
            memberName: "rozvrh",
            group: "ssps",
            description: "Zobrazí rozvrh hodin pro danou třídu",
            args: [{
                key: "className",
                type: "string",
                prompt: "Jakou třídu chcete zvolit?",
                validate(val) {
                    return /^[1-4]\.?[ABCKGL]$/i.test(val);
                }
            }]
        });
    }

    async run(msg, { className }) {
        className = className.replace(".", "").toUpperCase();
        className = api.map[className];
        if(!className) return msg.reply("Třída není podporovaná.");
        const sc = await api.getSchedule(className);

        const date = DateTime.now();
        if(date.hour > 16) date.plus({ days: 1 }); // show tomorrow supplementations after 4PM
        const dayOfWeek = (date.weekday > 1 && date.weekday < 6 ? date.weekday : 1) - 1;
        const schedule = sc.schedule[dayOfWeek];

        const embed = new MessageEmbed();
        embed.setTitle("Rozvrh");
        embed.setDescription(`Rozvrh pro třídu ${api.demap[className]} pro ${date.toFormat("cccc")}`);

        for(let cellI in schedule) {
            cellI = parseInt(cellI);
            let cell = schedule[cellI];
            if(!cell) {
                console.log("Wut?", cellI, cell);
                continue;
            }
            if(!Array.isArray(cell)) cell = [cell];
            for(const scell of cell) {       
                embed.addField(scell.Subject.Abbrev, `\`${api.formatRoom(scell.Room.Abbrev) || "?"}\` - ${scell.Teacher.Name} - **${scell.Group.Name}**`, cell.length > 1);
            }
            if(cell.length > 1 && Array.isArray(schedule[cellI + 1]) && schedule[cellI + 1].length > 1) embed.addField("\u200B", "\u200B", true);
        }

        return msg.say(embed);
    }
};