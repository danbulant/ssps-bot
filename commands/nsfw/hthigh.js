const commando = require("@iceprod/discord.js-commando");
const fetch = require("node-fetch");

module.exports = class HThigh extends commando.Command {
    constructor(client) {
        super(client, {
            name: "hthigh",
            memberName: "hthigh",
            group: "nsfw",
            nsfw: true,
            description: "Thigh image",
            args: []
        });
    }

    async run(msg) {
        var params = new URLSearchParams({
            type: "hthigh"
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
