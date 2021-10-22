const { DateTime } = require("luxon");
const fetch = require("node-fetch");

async function request(endpoint, body) {
    const res = await fetch("https://www.ssps.cz/" + endpoint, {
        method: body ? "POST" : "GET",
        body,
        headers: {
            accept: "application/json",
            "user-agent": "Discord Bot (https://danbulant.eu Daniel Bulant bulant.da.2021@ssps.cz)",
            "x-notes": "Zobrazeni informaci o skole v ramci Discordu"
        }
    });
    return await res.json();
}

/**
 * @typedef AbsentClass
 * @property {ClassEntity} Entity
 * @property {(null | "ODP")[]} Reasons
 */
/**
 * @typedef ClassEntity
 * @property {string} Id
 * @property {string} Abbrev
 */
/**
 * @typedef ChangedClass
 * @property {ClassEntity} Class
 * @property {ChangedLesson[]} ChangedLessons
 * @property {ChangedLesson[]} CancelledLessons
 * @property {string[]} ChangedGroups
 */
/**
 * @typedef ChangedLesson
 * @property {"supluje" | "přesun  >>" | "přesun  <<" | "spojí"} ChgType1
 * @property {string} ChgType2
 * @property {string} Hour Číslo ale ve stringu
 * @property {string} Subject 3 letter code in uppercase
 * @property {string} Group Empty if all
 * @property {string} [Room] Room number
 * @property {string} [Teacher] Teacher code (Abbrev) 
 */

class Supplementations {
    constructor(data) {
        /** @type {{ AbsentClasses: AbsentClass[], ChangesForClasses: ChangedClass[]}} */
        this.data = data;
    }

    getByClassName(name) {
        const absent = this.data.AbsentClasses.filter(t => t.Entity.Abbrev === name);
        const changed = this.data.ChangesForClasses.filter(t => t.Class.Abbrev === name);
        return { absent, changed };
    }

    getByTeacher(abbrev) {
        return this.data.ChangesForTeachers.filter(t => t.Teacher.Abbrev === abbrev || t.Teacher.Name === abbrev);
    }
}

/**
 * @typedef Atom
 * @property {string} Id
 * @property {string} Abbrev
 * @property {string} Name
 */
/**
 * @typedef CellAtom
 * @property {Atom} Class
 * @property {Atom} Group
 * @property {Atom} Subject
 * @property {Atom} Teacher
 * @property {Atom} Room
 * @property {Atom[]} Cycles
 * @property {Atom[]} Stamps
 */

class Schedule {
    /** @type {(CellAtom | CellAtom[])[][]} */
    schedule = [];
    constructor(data) {
        this.data = data;
        for(var cell of data.Cells) {
            if(!this.schedule[cell.DayIndex]) this.schedule[cell.DayIndex] = [];
            this.schedule[cell.DayIndex][cell.HourIndex] = cell.Atoms;
        }
    }

    get type() {
        return this.data.Type;
    }

    get id() {
        return this.data.TargetId;
    }
}

/**
 * @typedef WPPost
 * @property {number} id
 * @property {string} date ISO date
 * @property {string} date_gmt
 * @property {{ rendered: string }} guild
 * @property {string} modified ISO date
 * @property {string} modified_gmt
 * @property {string} slug Used in pretty URLs
 * @property {string} status Always publish in public API
 * @property {"post"} type
 * @property {string} link
 * @property {{ rendered: string }} title
 * @property {{ rendered: string, protected: boolean }} content
 * @property {{ rendered: string, protected: boolean }} excerpt
 * @property {number} author
 * @property {number} featured_media
 * @property {"closed" | "open"} comment_status Seems to be always closed
 * @property {"closed" | "open"} ping_status Seems to be always on
 * @property {boolean} sticky
 * @property {string} template
 * @property {string} format commonly 'standard'
 * @property {[]} meta ?
 * @property {number[]} categories
 * @property {WPPostLinks} _links
 */
/**
 * @typedef WPPostLinks
 * @property {{ href: string }[]} self
 * @property {{ href: string }[]} collection
 * @property {{ href: string }[]} about
 * @property {{ href: string, embeddable: boolean }[]} author
 * @property {{ href: string, embeddable: boolean }[]} replies
 * @property {{ href: string, count: number }[]} version-history
 */

class API {
    request = request;

    async getSupplementations(date = new DateTime) {
        const res = await request(`wp-content/themes/ssps-wordpress-theme/supplementation.php/?date=${date.toFormat("yyyyMMdd")}`);

        return new Supplementations(res);
    }

    async getSchedule(className) {
        const res = await request(`wp-content/themes/ssps-wordpress-theme/schedule.php/?class=${className}`);

        return new Schedule(res);
    }

    async getNews() {
        /** @type {WPPost[]} */
        const res = await request(`wp-json/wp/v2/posts`);

        return res;
    }

    formatRoom(room) {
        if(!room) return "";
        return room.toString().padStart(3, "0");
    }

    groups = [
        ["celá třída"],
        ["Skupina 1", "Skupina 2"],
        ["Cizí jazyk 1", "Cizí jazyk 2"]
    ]

    map = {
        "1A": "1U",
        "1B": "1V",
        "1C": "1W",
        "1G": "1X",
        "1K": "1Y",
        "2A": "1P",
        "2B": "1Q",
        "2C": "1R",
        "2L": "1S",
        "2K": "1T",
        "3A": "1K",
        "3B": "1L",
        "3C": "1M",
        "3L": "1N",
        "3K": "1O",
        "4A": "1E",
        "4B": "1F",
        "4C": "1G",
        "4L": "1I",
        "4K": "1J"
    }
    demap = {
        "1U": "1A",
        "1V": "1B",
        "1W": "1C",
        "1X": "1G",
        "1Y": "1K",
        "1P": "2A",
        "1Q": "2B",
        "1R": "2C",
        "1S": "2L",
        "1T": "2K",
        "1K": "3A",
        "1L": "3B",
        "1M": "3C",
        "1N": "3L",
        "1O": "3K",
        "1E": "4A",
        "1F": "4B",
        "1G": "4C",
        "1I": "4L",
        "1J": "4K",
    }
}

module.exports = new API;
