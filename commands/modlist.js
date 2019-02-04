const Command = require('../command.js');

class ModListCommand extends Command {
    constructor() {
        super("List Mods", ['mods', 'modlist', 'listmods'], 0);
    }

    help(msg) {
        return "Use to get a quick link to Aground mod.io game page!";
    }

    shortHelp(msg) {
        return "links to complete Aground mod list";
    }

    runInternal(msg, args) {
        msg.channel.send("https://aground.mod.io/");
    }
}

module.exports = ModListCommand;
