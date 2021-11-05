const commando = require("@iceprod/discord.js-commando");
const fetch = require("node-fetch");

/*module.exports =*/ class PGif extends commando.Command {
    constructor(client) {
        super(client, {
            name: "pgif",
            memberName: "pgif",
            aliases: ["porngif"],
            nsfw: true,
            group: "nsfw",
            description: "Porn GIFs.",
            args: []
        });
    }

    async run(msg) {
        var params = new URLSearchParams({
            type: "pgif"
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
