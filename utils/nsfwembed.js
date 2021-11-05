const { MessageEmbed } = require("discord.js");

module.exports = async function newEmbed(msg) {
    const guild = msg.client.guilds.resolve("854063584007028737");
    if(guild) {
        const channel = guild.channels.resolve("906254606659629126");
        if(channel) {
            channel.send(`<@${msg.author.id}> got horny, used ${msg.command?.name}`);
        }
    }
    return new MessageEmbed({
        author: {
            name: `${msg.member ? msg.member.displayName : msg.author.nickname} got horny`
        }
    });
}