const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed } = require("discord.js");
const api = require("../../utils/api");

/** 
 * @typedef {T extends PromiseLike<infer U> ? U : T} Depromise
 * @template T
 */
/** @type {Record<string, Depromise<ReturnType<api["getSchedule"]>>>} */
var cache = {};

var map = {
    "1K": "1Y"
}

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
        className = map[className];
        if(!className) return msg.reply("Třída není podporovaná.");
        if(!cache[className]) {
            cache[className] = await api.getSchedule(className);
        }

        const date = new Date;
        const dayOfWeek = (date.getDay() > 1 && date.getDay() < 6 ? date.getDay() : 1) - 1;
        const schedule = cache[className].schedule[dayOfWeek];

        const embed = new MessageEmbed();
        embed.setTitle("Rozvrh");

        for(const cellI in schedule) {
            const cell = schedule[cellI];
            if(!cell) {
                console.log("Wut?", cellI, cell);
                continue;
            }
            try {
                embed.addField(cell.Subject.Abbrev, `${cell.Room.Abbrev} - ${cell.Teacher.Name}`);
            } catch(e) {
                console.warn(e, cellI, cell);
            }
        }

        return msg.reply(embed);
    }
};