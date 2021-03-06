const commando = require("@iceprod/discord.js-commando");
const minimist = require("minimist");
const api = require("../../utils/api");
const ssps = require("../../utils/ssps-server");
const Student = require("../../utils/models/student");
const Person = require("../../utils/models/person");
const Teacher = require("../../utils/models/teacher");
const Room = require("../../utils/models/room");
const Group = require("../../utils/models/group");

module.exports = class cmd extends commando.Command {
    constructor(client) {
        super(client, {
            name: "cmd",
            memberName: "cmd",
            aliases: ["run", "sh", "bash"],
            group: "ssps",
            description: "Runs a management command",
            argsType: "multiple"
        });
    }

    async run(msg, args) {
        const argv = minimist(args, {
            alias: {
                help: "h",
                force: "f"
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
            case "man":
            case "tldr":
            case "":
                return send(`
                Runs a simple management command without fancy argument parsing.
                For help of a given command, run it with -h or --help flag.

                Available commands:
                    help - Shows this page
                    connect <email> [--discord <id>] - Connects discord and user profile
                    teacher-connect <discord id> <email> - Connects discord and teacher profile
                    set-teacher-room <room> [email] [--force|-f] - Sets teacher's homeroom
                    groups [--user <discord id>] [--add <group>|--remove <group>] - Manages groups
                `);
            case "connect":
                return this.connectCmd(argv, send, msg);
            case "teacher-connect":
                return this.teacherConnectCmd(argv, send, msg);
            case "set-teacher-room":
                return this.setTeacherRoomCmd(argv, send, msg);
            case "groups":
                return this.groupsCmd(argv, send, msg);
            default:
                return send(`Command ${argv._[0]} not found`);
        }
    }

    async groupsCmd(argv, send, msg) {
        if(argv.help) return send(`
        Shows or update groups the user is part of.
        User defaults to current user, but can be set by --user <discord id>

        --add <group> - Adds group (group must belong to current user's class). Use abbreviation
        --remove <group> - Removes group (can't be the special 'whole class' group). Use abbreviation. Can be list of comma separated values.
        --user <discord id> - Selects another user (owner only)

        Format: groups [--user <discord id>] [--add <group>|--remove <group>]
        `);
        const person = await Person.findOne({
            where: { discord: argv.user || msg.author.id }
        });
        if(!person) return send("Student nenalezen");
        const student = await Student.findOne({
            where: { personId: person.id }
        });
        const groups = await student.getGroups();
        if((argv.add || argv.remove) && argv.user && !this.client.isOwner(msg.author)) return send("You are not in the sudoers file. This incident will be reported");
        if(argv.add) {
            const toAdd = argv.add.split(",");
            const toAddGroups = await Group.findAll({
                where: {
                    abbrev: toAdd,
                    classId: student.classId
                }
            });
            await student.addGroups(toAddGroups);
            return send("Skupiny p??id??ny");
        }
        if(argv.remove) {
            const toRemove = argv.remove.split(",");
            const toRemoveGroups = await Group.findAll({
                where: {
                    abbrev: toAdd,
                    classId: student.classId
                }
            });
            await student.removeGroups(toRemoveGroups);
            return send("Skupiny odebr??ny");
        }
        return send(`
Student je sou????st?? t??chto skupin:

${groups.map(t => `- ${t.abbrev} (${t.name})`).join("\n")}
        `);
    }

    async setTeacherRoomCmd(argv, send, msg) {
        if(argv.help) return send(`
        Updates teacher room.

        --force -f - Forces update of room, even if the room doesn't exist (creates it in database)
        email - Select which user to set the room of. Owner only.

        Format: set-teacher-room <room> [email] [--force|-f]
        `);
        if((argv._[1] || argv.force) && !this.client.isOwner(msg.author)) return send("You are not in the sudoers file, this incident will be reported.");
        var mail = argv._[1];
        var room = argv._[0];
        if(mail && !api.isTeacherMail(mail)) return send("Email m?? ??patn?? form??t");
        var person;
        if(!mail) {
            person = await Person.findOne({
                where: { discord: msg.author.id }
            });
        } else {
            person = await Person.findOne({
                where: { mail }
            });
        }
        if(!person) return send("Nen?? p??ipojen?? ??koln?? ????et");
        if(person.type !== "teacher") return send("Nejste u??itelem");
        var r = await Room.findOne({
            where: { id: room }
        });
        if(!r && !argv.force) return send("U??ebna neexistuje");
        if(!r) r = await Room.create({ id: room }); 
        var teacher = await Teacher.findOne({
            where: { personId: person.id }
        });
        teacher.room = room;
        await teacher.save();
        return send("Hotovo");
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

        if(!/^[0-9]+$/.test(discord)) return send("??patn?? discord ????et");
        var user = await this.client.users.fetch(discord).catch((e) => console.warn(e));
        if(!user) return send("U??ivatel mus?? b??t v SSP?? discordu.");

        if(!api.isTeacherMail(mail)) return send("Email m?? ??patn?? form??t.");

        const person = await Person.findOne({
            where: {
                mail
            }
        });
        if(!person) return send("U??itel nenalezen");
        const teacher = await Teacher.findOne({
            where: {
                personId: person.id
            }
        });
        if(!teacher) return send("Nastala nezn??m?? chyba p??i hled??n?? u??itele");
        person.discord = discord;
        await person.save();
        return send("U??itel propojen");
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
        if(!/^[0-9]+$/.test(discord)) return send("??patn?? discord ????et");
        var user = await this.client.users.fetch(discord).catch(() => null);
        if(!user) return send("U??ivatel mus?? b??t v SSP?? discordu.");
        if(argv.discord && !this.client.isOwner(msg.author)) return send("Pouze vlastn??k m????e pou????t --discord <id>.");
        const email = argv._[1];
        if(!email) return send("Chyb?? email");
        if(!api.isStudentMail(email)) return send("??patn?? email. Pou??ijte ??koln?? email bez skola.");

        const student = await Student.findOne({
            where: {
                id: email.split("@")[0]
            }
        });
        if(!student) return send("Student nenalezen. Moment??ln?? je vy??adov??no aby byl student registrovan?? na profesn?? s??ti.");
        const userClass = ssps.getClass(msg.author);
        const classID = api.map[userClass];
        if(student.classId && student.classId !== classID) return send(`T????da neodpov??d?? roli na SSP?? serveru`);
        if(!student.personId) return send("Nen?? vytvo??en?? u??ivatelsk?? profil - BUG");
        const person = await Person.findOne({
            where: {
                id: student.personId
            }
        });
        if(person.mail !== email) return send("Student nenalezen.");
        person.discord = discord;
        await person.save();
        if(student.classId) await student.setClassID(student.classId, true);
        await student.syncClass();
        return send("Propojeno");
    }
};