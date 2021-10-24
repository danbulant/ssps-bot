const Commando = require('@iceprod/discord.js-commando');
const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");
const yaml = require("js-yaml");
const fs = require("fs-extra");
const path = require("path");
const luxon = require("luxon");

luxon.Settings.defaultLocale = "cs";
luxon.Settings.defaultZone = new luxon.IANAZone("Europe/Prague");

const config = yaml.load(fs.readFileSync("./config.yml", { encoding: "utf-8" }));
global.config = config;

require("./utils/sequelize");

const client = new Commando.Client({
    owner: '820696421912412191',
    commandPrefix: "ssps!",
    presence: {
        activity: {
            type: "WATCHING",
            name: "prestiž"
        }
    }
});

global.client = client;

client.on("commandError", (c, e) => {
    console.error(e);
});

client.on("ready", () => {
    console.log("Ready");
});

const serializeArgs = (args) => {
    if(typeof args === "string") return args;
    if(Array.isArray(args)) return args.join("&");
    return Object.entries(args).map(t => `${t[0]}=${encodeURIComponent(t[1].toString())}`).join("&");
}

client.on("commandRun", (c, p, msg, args) => {
    console.log(`[RUN]: ${msg.author.tag}@${msg.guild?.name || "DM"}#${msg.channel?.name || "default"}/${c.groupID}/${c.name}?${serializeArgs(args)} | ${msg.content}`);
});

client.registry
    .registerGroups([
        ["ssps", "Příkazy pro SSPŠ"],
        ["nastaveni", "Nastavení bota"]
    ])
    .registerDefaultTypes()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open({
        driver: sqlite3.Database,
        filename: path.join(__dirname, 'settings.sqlite3')
    }).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.login(config.token);