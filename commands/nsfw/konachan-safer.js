const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

module.exports = class Konachan2 extends commando.Command {
    constructor(client) {
        super(client, {
            name: "konachan-safer",
            memberName: "konachan-safer",
            aliases: ["konachan-safe", "konachan2"],
            group: "nsfw",
            nsfw: true,
            description: "Random konachan image."
        });
    }

    async run(msg) {
        const res = await fetch("https://konachan.net/post.json?limit=1&page=" + Math.floor(Math.random() * 241260));
        var img = (await res.json())[0];
        var embed = await newEmbed(msg);
        embed.setTitle("Konachan");
        embed.setDescription(`Od ${img.author}`);
        embed.setImage(img.file_url);
        return msg.channel.send(embed);
    }
};
