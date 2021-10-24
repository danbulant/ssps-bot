const commando = require("@iceprod/discord.js-commando");
const minimist = require("minimist");
const api = require("../../utils/api");
const ssps = require("../../utils/ssps-server");
const Student = require("../../utils/models/student");
const Person = require("../../utils/models/person");
const Teacher = require("../../utils/models/teacher");

module.exports = class cmd extends commando.Command {
    constructor(client) {
        super(client, {
            name: "cmd",
            memberName: "cmd",
            aliases: ["run"],
            group: "ssps",
            description: "Runs a management command",
            argsType: "multiple"
        });
    }

    async run(msg, args) {
        const argv = minimist(args, {
            alias: {
                help: "h"
            },
            string: "_"
        });

        /** @param {string} str */
        function send(str) {
            var lines = str.split("\n").map(t => t.trimRight());
            while(lines[0].length === 0) lines.shift();
            while(lines[lines.length - 1].length === 0) lines.pop();
            var shortestTrim = lines
                .map(a => a.match(/\S/) && a.match(/^\s*/)[0].length)
                .filter(a => a !== null)
                .reduce((a, b) => Math.min(a, b));
            lines = lines.map(t => t.substr(shortestTrim));
            while(lines[0].length === 0) lines.shift();
            while(lines[lines.length - 1].length === 0) lines.pop();
            var sentLines = [""];
            for(const line of lines) {
                if(sentLines[sentLines.length - 1] && sentLines[sentLines.length - 1].length + line.lenght > 2048)
                    sentLines[sentLines.length] = line;
                else
                    sentLines[sentLines.length - 1] = (sentLines[sentLines.length - 1] || "") + "\n" + line;
            }
            return sentLines.map(t => msg.say("```\n" + t.substr(1) + "\n```"));
        }

        switch(argv._[0]) {
            case "help":
                return send(`
                Runs a simple management command without fancy argument parsing.
                For help of a given command, run it with -h or --help flag.

                Available commands:
                    help - Shows this page
                    connect <email> [--discord <id>] - Connects discord and user profile
                    teacher-connect <discord id> <email>- Connects discord and teacher profile
                    set-teacher-room <room> [email] - Sets teacher's homeroom
                `);
            case "connect":
                return this.connectCmd(argv, send, msg);
            case "teacher-connect":
                return this.teacherConnectCmd(argv, send, msg);
            case "set-teacher-room":
                return send("Not yet implemented");
            default:
                return send(`Command ${argv._[0]} not found`);
        }
    }

    async teacherConnectCmd(argv, send, msg) {
        if(argv.help) return send(`
        Connects discord and teacher profile.
        Owner only

        Format: teacher-connect <discord id> <email>
        `);
        if(!this.client.isOwner(msg.author)) return send("You are not in the sudoers file, this incident will be reported.");
        var discord = argv._[1];
        var mail = argv._[2];

        if(!/^[0-9]+$/.test(discord)) return send("Špatný discord účet");
        var user = await this.client.users.fetch(discord).catch((e) => console.warn(e));
        if(!user) return send("Uživatel musí být v SSPŠ discordu.");

        if(!api.isTeacherMail(mail)) return send("Email má špatný formát.");

        const person = await Person.findOne({
            where: {
                mail
            }
        });
        if(!person) return send("Učitel nenalezen");
        const teacher = await Teacher.findOne({
            where: {
                personId: person.id
            }
        });
        if(!teacher) return send("Nastala neznámá chyba při hledání učitele");
        person.discord = discord;
        await person.save();
        return send("Učitel propojen");
    }

    async connectCmd(argv, send, msg) {
        if(argv.help) return send(`
        Connects discord and user profile.
        Defaults to connecting this account, use --discord <id> to connect another account.
        Only bot owner can connect other discord accounts.
        If there's already a connected account, it's disconnected first.

        Format: connect <email> [--discord <id>]
        `);
        var discord = argv.discord || msg.author.id;
        if(!/^[0-9]+$/.test(discord)) return send("Špatný discord účet");
        var user = await this.client.users.fetch(discord).catch(() => null);
        if(!user) return send("Uživatel musí být v SSPŠ discordu.");
        if(argv.discord && !this.client.isOwner(msg.author)) return send("Pouze vlastník může použít --discord <id>.");
        const email = argv._[1];
        if(!email) return send("Chybí email");
        if(!api.isStudentMail(email)) return send("Špatný email. Použijte školní email bez skola.");

        const student = await Student.findOne({
            where: {
                id: email.split("@")[0]
            }
        });
        if(!student) return send("Student nenalezen. Momentálně je vyžadováno aby byl student registrovaný na profesní síti.");
        const userClass = ssps.getClass(msg.author);
        const classID = api.map[userClass];
        if(student.classId !== classID) return send(`Třída neodpovídá roli na SSPŠ serveru`);
        if(!student.personId) return send("Není vytvoření uživatelský profil - BUG");
        const person = await Person.findOne({
            where: {
                id: student.personId
            }
        });
        if(person.mail !== email) return send("Student nenalezen.");
        person.discord = discord;
        await person.save();
        return send("Propojeno");
    }
};