const commando = require("@iceprod/discord.js-commando");

module.exports = class suplovani extends commando.Command {
    constructor(client) {
        super(client, {
            name: "suplovani",
            memberName: "suplovani",
            group: "ssps",
            description: "Zobrazí stav suplování",
            args: []
        });
    }

    run(msg) {
        return msg.reply("TBD");
    }
};