const commando = require("@iceprod/discord.js-commando");
const fetch = require("node-fetch");

module.exports = class FourK extends commando.Command {
    constructor(client) {
        super(client, {
            name: "4k",
            memberName: "4k",
            group: "nsfw",
            nsfw: true,
            description: "KKKK",
            args: []
        });
    }

    async run(msg) {
        var params = new URLSearchParams({
            type: "4k"
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
