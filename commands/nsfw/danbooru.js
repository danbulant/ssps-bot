const commando = require("@iceprod/discord.js-commando");
const newEmbed = require("../../utils/nsfwembed");
const fetch = require("node-fetch");

module.exports = class Danbooru extends commando.Command {
    constructor(client) {
        super(client, {
            name: "danbooru",
            memberName: "danbooru",
            group: "nsfw",
            nsfw: true,
            description: "Random image from danbooru"
        });
    }

    async run(msg) {
        var url = "https://danbooru.donmai.us/posts/" + Math.floor(Math.random() * 3830000) + ".json";
        const post = await fetch(url).then(r => r.json());

        var embed = await newEmbed(msg);
        embed.setTitle("Danbooru");
        embed.setDescription(post.tag_string_character);
        embed.setImage(post.file_url);
        return msg.channel.send(embed);
    }
};
