const commando = require("@iceprod/discord.js-commando");
const fetch = require("node-fetch");

module.exports = class Awooify extends commando.Command {
    constructor(client) {
        super(client, {
            name: "tentacle",
            memberName: "tentacle",
            group: "nsfw",
            nsfw: true,
            description: "Tentacle image",
            args: []
        });
    }

    async run(msg) {
        var params = new URLSearchParams({
            type: "tentacle"
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
