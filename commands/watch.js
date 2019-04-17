const Command = require('../command.js');
const ModService = require('../services/mods.js');

class WatchCommand extends Command {
    constructor() {
        super("Watch Comments", ['watch'], 1);
    }

    setAuth(auth) {
        super.setAuth(auth);
        this.apikey = auth.apikey;
    }

    help(msg) {
        return "`]watch {MOD NAME PART}` to start watching mod with the `MOD NAME PART`  in its name";
    }

    shortHelp(msg) {
        return "starts watching comments for a mod";
    }

    runInternal(msg, args) {
        let sterm = args.slice(1).join("_");
        ModService.watchModComments(this.apikey, msg.author.id, sterm, msg);
    }
}

module.exports = WatchCommand;
