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
        this.data = data;
    }

    getByClassName(name) {
        /** @type {AbsentClass[]} */
        const absent = this.data.AbsentClasses.filter(t => t.Entity.Abbrev === name);
        /** @type {ChangedClass[]} */
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
    /** @type {CellAtom[][]} */
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

class API {
    request = request;

    async getSupplementations(date = new Date) {
        const res = await request(`wp-content/themes/ssps-wordpress-theme/supplementation.php/?date=${date.getFullYear()}${date.getMonth().toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`);

        return new Supplementations(res);
    }

    async getSchedule(className) {
        const res = await request(`wp-content/themes/ssps-wordpress-theme/schedule.php/?class=${className}`);

        return new Schedule(res);
    }
}

module.exports = new API;