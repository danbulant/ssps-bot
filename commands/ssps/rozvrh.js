const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed } = require("discord.js");
const { DateTime } = require("luxon");
const api = require("../../utils/api");
const Group = require("../../utils/models/group");
const Subject = require("../../utils/models/subject");
const Teacher = require("../../utils/models/teacher");
const Timetable = require("../../utils/models/timetable");
const ssps = require("../../utils/ssps-server");

module.exports = class rozvrh extends commando.Command {
    /**
     * @arg {import("@iceprod/discord.js-commando").CommandoClient} client
     * */
    constructor(client) {
        super(client, {
            name: "rozvrh",
            memberName: "rozvrh",
            group: "ssps",
            description: "Zobrazí rozvrh hodin pro danou třídu",
            args: [{
                key: "className",
                prompt: "Jakou třídu chcete zvolit?",
                isEmpty(val, msg) {
                    if(val) return false;
                    return !ssps.getClass(msg.author);
                },
                validate(val, msg) {
                    if(/^[1-4]\.?[ABCKGL]$/i.test(val)) return true;
                    return !!ssps.getClass(msg.author);
                },
                parse(val, msg) {
                    if(val) return val;
                    return ssps.getClass(msg.author);
                }
            }]
        });
    }

    async run(msg, { className }) {
        className = className.replace(".", "").toUpperCase();
        className = api.map[className];
        if(!className) return msg.reply("Třída není podporovaná.");

        let date = DateTime.now();
        if(date.hour > 16) date = date.plus({ days: 1 }); // show tomorrow supplementations after 4PM
        if(date.weekday === 0 || date.weekday === 7) {
            date = date.plus({ days: date.weekday === 0 ? 2 : 1 });
        }
        const schedule = await Timetable.findAll({
            where: {
                day: date.weekday - 1,
                classId: className
            },
            order: [["hour", "ASC"]],
            include: [Group, Subject, Teacher]
        })

        const embed = new MessageEmbed();
        embed.setTitle("Rozvrh");
        embed.setDescription(`Rozvrh pro třídu ${api.demap[className]} pro ${date.toFormat("cccc")}`);

        var array = [];
        for(let cell of schedule) {
            if(!array[cell.hour]) array[cell.hour] = [];
            array[cell.hour].push(cell);
        }
        for(let cellI in array) {
            let cells = array[cellI];
            if(!cells) continue;

            for(const scell of cells) {
                embed.addField(scell.subject.abbrev, `\`${api.formatRoom(scell.roomId) || "?"}\` - ${scell.teacher.name} - **${scell.group.name}**`, cells.length > 1);
            }
            if(cells.length > 1 && schedule[cellI + 1].length > 1) embed.addField("\u200B", "\u200B", true);
        }

        return msg.say(embed);
    }
};