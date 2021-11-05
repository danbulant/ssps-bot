const commando = require("@iceprod/discord.js-commando");
const fetch = require("node-fetch");

module.exports = class Paizuri extends commando.Command {
    constructor(client) {
        super(client, {
            name: "paizuri",
            memberName: "paizuri",
            group: "nsfw",
            nsfw: true,
            description: "Paizuri image",
            args: []
        });
    }

    async run(msg) {
        var params = new URLSearchParams({
            type: "paizuri"
        });
        var data = await fetch("https://nekobot.xyz/api/image?" + params.toString()).then(r => r.json());
        if(!data.success) {
            return msg.channel.send("Selhalo načítání obrázku");
        }
        return msg.channel.send({
            files: [
                data.message
            ]
        });
    }
};
