const commando = require("@iceprod/discord.js-commando");
const fetch = require("node-fetch");

/*module.exports =*/ class Anal extends commando.Command {
    constructor(client) {
        super(client, {
            name: "anal",
            memberName: "anal",
            group: "nsfw",
            nsfw: true,
            description: "Anal image",
            args: []
        });
    }

    async run(msg) {
        var params = new URLSearchParams({
            type: "anal"
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
