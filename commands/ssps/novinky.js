const commando = require("@iceprod/discord.js-commando");
const { MessageEmbed } = require("discord.js");
const TurndownService = require('turndown');
const api = require("../../utils/api");

const turndownService = new TurndownService({
    bulletListMarker: "-",
    codeBlockStyle: "fenced"
});

module.exports = class novinky extends commando.Command {
    constructor(client) {
        super(client, {
            name: "novinky",
            memberName: "novinky",
            group: "ssps",
            description: "Zobrazí novinky ze školy",
            args: []
        });
    }

    async run(msg) {
        const news = await api.getNews();
        const embed = new MessageEmbed();

        embed.setTitle("Novinky ze školy");

        for(const post of news.slice(0, 25)) {
            embed.addField(
                post.title.rendered.trim(),
                turndownService.turndown(post.excerpt.rendered)
            );
        }

        return msg.reply(embed);
    }
};