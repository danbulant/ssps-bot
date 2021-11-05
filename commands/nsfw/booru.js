var cheerio = require("cheerio");
const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

module.exports = class Booru extends commando.Command {
    constructor(client) {
        super(client, {
            name: "booru",
            memberName: "booru",
            group: "nsfw",
            nsfw: true,
            description: "Random image from booru site",
            args: [
                {
                    type: "string",
                    key: "booru",
                    prompt: "Kterou booru stránku z booru.org použít?"
                }
            ]
        });
    }

    async run(msg, { booru }) {
        try {
            var r = await fetch("http://" + booru + ".booru.org/");
            var max = 50;

            var s = cheerio.load(r.body);
            max = parseInt(s("p:first-child").text().substr(8).replace(/,/g, ""));

            if(isNaN(max)) {
                return msg.channel.send("Booru stránka nenalezena");
            }

            var url = "http://" + booru + ".booru.org/index.php?page=dapi&s=post&q=index&id=" + Math.floor(Math.random() * max);
            var res = await fetch(url);
            var $ = cheerio.load(await res.text(), { xmlMode: true });

            var src = $("post").attr("file_url");
            var embed = await newEmbed(msg);
            embed.setTitle(booru);
            embed.setImage(src);
            return msg.channel.send(embed);
        } catch(e) {
            return msg.channel.send("Booru stránka s tímto názvem nanelezena");
        }
    }
};
