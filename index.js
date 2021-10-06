const Commando = require('@iceprod/discord.js-commando');
const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");
const yaml = require("js-yaml");
const fs = require("fs-extra");
const path = require("path");

const config = yaml.load(fs.readFileSync("./config.yml", { encoding: "utf-8" }));

const client = new Commando.Client({
    owner: '820696421912412191',
    commandPrefix: "ssps!"
});

client.on("commandError", (c, e) => {
    console.error(e);
});

client.on("ready", () => {
    console.log("Ready");
});

client.registry
    .registerGroups([
        ["ssps", "Příkazy pro SSPŠ"],
        ["nastaveni", "Nastavení bota"]
    ])
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
    sqlite.open({
        driver: sqlite3.Database,
        filename: path.join(__dirname, 'settings.sqlite3')
    }).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.login(config.token);