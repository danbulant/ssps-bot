var cheerio = require("cheerio");
const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

/*module.exports =*/ class RealBooru extends commando.Command {
    constructor(client) {
        super(client, {
            name: "realbooru",
            memberName: "realbooru",
            group: "nsfw",
            nsfw: true,
            description: "Real booru"
        });
    }

    async run(msg) {
        const res = await fetch("https://realbooru.com/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 692475));
        var $ = cheerio.load(await res.text(), { xmlMode: true });

        var src = $("post").attr("file_url");
        var embed = await newEmbed(msg);
        embed.setTitle("Real booru");
        embed.setImage(src);
        return msg.channel.send(embed);
    }
};
