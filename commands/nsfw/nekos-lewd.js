const newEmbed = require("../../utils/nsfwembed");
const Nekos = require("nekos.life");
const neko = new Nekos().nsfw;
const commando = require("@iceprod/discord.js-commando");

module.exports = class NekosCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "nekos-lewd",
            group: "nsfw",
            nsfw: true,
            memberName: "nekos",
            description: "Uses the nekos.life API. NSFW only.",
            examples: ["nekos-lewd help"],
            args: [
                {
                    type: "string",
                    key: "command",
                    prompt: "Který příkaz chcete spustit?"
                }
            ]
        });
    }

    async run(msg, cmd) {
        var c = cmd.command;

        if(c === "help") return await this.help();

        else {
            if(typeof neko[c] === "function") {
                return await this.nonText(c, msg);
            } else {
                return await msg.channel.send("Neexistující příkaz nebo SFW.");
            }
        }
    }

    async nonText(cmd, msg) {
        var json = await neko[cmd]();
        return await this.send(json.url, msg);
    }

    help() {
        return this.msg.channel.send("Otevřete https://github.com/Nekos-life/nekos-dot-life pro dostupné příkazy. Použijte je jako `!nekos-lewd <cmd>`. Pouze NSFW.");
    }

    async send(src, msg) {
        var embed = await newEmbed(msg);
        embed.setTitle("Nekos!");
        embed.setImage(src);
        return msg.channel.send(embed);
    }
};
