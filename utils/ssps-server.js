
const roles = {
    "882938478525050911": "1K",
    "882938577632247829": "1A",
    "882938625581527111": "1B",
    "882938838480207892": "1C",
    "882938589002989568": "1G",
    "887339014020038717": "2K",
    "886966083897155665": "2A",
    "887339001084796928": "2B",
    "887339009783779379": "2C",
    "887339017480335390": "2L",
    "887339028859486208": "3K",
    "887339020030443561": "3A",
    "887339023180398663": "3B",
    "887339025910878268": "3C",
    "887339031388631050": "3L",
    "887339042260279326": "4K",
    "887339033817153567": "4A",
    "887339036891566100": "4B",
    "887339039533957151": "4C",
    "887339044961406996": "4L"
};

/**
 * 
 * @param {import("discord.js").User} user 
 */
function getClass(user) {
    if(!user.client.guilds.resolve(server)) return null;
    if(!user.client.guilds.resolve(server).member(user)) return null;
    return Object.entries(roles).find(([id, name]) =>
        user.client.guilds.resolve(server).member(user).roles.cache.has(id)
    )?.[1];
}

const server = "882560404167995443";

module.exports = {
    roles,
    server,
    getClass
}