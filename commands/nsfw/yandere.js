const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

module.exports = class Xkcd extends commando.Command {
    constructor(client) {
        super(client, {
            name: "yandere",
            memberName: "yandere",
            group: "nsfw",
            nsfw: true,
            description: "Random image of yandere"
        });
    }

    async run(msg) {
        var url = "https://yande.re/post.json?limit=1&page=" + Math.floor(Math.random() * 621767);
        var res = await fetch(url);
        var post = (await res.json())[0];

        var embed = await newEmbed(msg);
        embed.setTitle("Yandere");
        embed.setDescription("Od " + post.author + "\nObrázky se mohou načítat nějakou dobu.");
        embed.setImage(post.file_url);
        embed.setThumbnail(post.sample_url);
        return msg.channel.send(embed);
    }
};
