var cheerio = require("cheerio");
const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

/* module.exports =*/ class KonachanLewd extends commando.Command {
    constructor(client) {
        super(client, {
            name: "konachan-lewd",
            memberName: "konachan-lewd",
            alias: ["konachan"],
            nsfw: true,
            group: "nsfw",
            description: "Random konachan image. NSFW."
        });
    }

    async run(msg) {
        const res = await fetch("https://konachan.com/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 2412000));
        var $ = cheerio.load(await res.text(), { xmlMode: true });

        var src = $("post").attr("file_url");
        var embed = await newEmbed(msg);
        embed.setTitle("Konachan");
        embed.setImage(src);
        return msg.channel.send(embed);
    }
};
