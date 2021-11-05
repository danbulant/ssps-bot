var cheerio = require("cheerio");
const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

module.exports = class R34 extends commando.Command {
    constructor(client) {
        super(client, {
            name: "rule34",
            memberName: "rule34",
            group: "nsfw",
            nsfw: true,
            description: "Random safebooru image."
        });
    }

    async run(msg) {
        const res = await fetch("https://rule34.xxx/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * 3297000));
        var $ = cheerio.load(await res.text(), { xmlMode: true });

        var src = $("post").attr("file_url");
        var embed = await newEmbed(msg);
        embed.setTitle("Rule34");
        embed.setImage(src);
        return await msg.channel.send(embed);
    }
};
