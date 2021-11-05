var cheerio = require("cheerio");
const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

/*module.exports =*/ class XBooru extends commando.Command {
    constructor(client) {
        super(client, {
            name: "xbooru",
            memberName: "xbooru",
            group: "nsfw",
            nsfw: true,
            description: "Dirty sister of rule34"
        });
    }

    async run(msg) {
        var res = await fetch("https://xbooru.com/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 709426));
        var $ = cheerio.load(await res.text(), { xmlMode: true });

        var src = $("post").attr("file_url");
        var embed = await newEmbed(msg);
        embed.setTitle("Xbooru");
        embed.setImage(src);
        return await msg.channel.send(embed);
    }
};
