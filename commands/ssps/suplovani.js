const commando = require("@iceprod/discord.js-commando");
const api = require("../../utils/api");

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
        const suplementations = await api.getSupplementations();
        
    }
};