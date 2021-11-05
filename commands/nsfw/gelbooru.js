var cheerio = require("cheerio");
const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

module.exports = class Gelbooru extends commando.Command {
    constructor(client) {
        super(client, {
            name: "gelbooru",
            memberName: "gelbooru",
            group: "nsfw",
            nsfw: true,
            description: "Random image from gelbooru"
        });
    }

    async run(msg) {
        const res = await fetch("https://gelbooru.com/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 69317));
        var $ = cheerio.load(await res.text(), { xmlMode: true });

        var src = $("post").attr("file_url");
        var embed = await newEmbed(msg);
        embed.setTitle("Gelbooru");
        embed.setImage(src);
        return msg.channel.send(embed);
    }
};
