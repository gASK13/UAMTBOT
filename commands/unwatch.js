const Command = require('../command.js');
const ModService = require('../services/mods.js');

class UnWatchCommand extends Command {
    constructor() {
        super("Stop Watching Comments", ['unwatch', 'uwatch'], 1);
    }

    help(msg) {
        return "`]unwatch {MOD NAME PART}` to stop watching mod with the `MOD NAME PART` in its name";
    }

    shortHelp(msg) {
        return "stops watching comments for a mod";
    }

    runInternal(msg, args) {
        let sterm = args.slice(1).join("_");
        ModService.unwatchModComments(this.apikey, msg.author.id, sterm, msg);
    }
}

module.exports = UnWatchCommand;
