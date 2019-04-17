const Command = require('../command.js');
const ModService = require('../services/mods.js');

class ModCommand extends Command {
    constructor() {
        super("Mod Search", ['mod'], 1);
    }

    setAuth(auth) {
        super.setAuth(auth);
        this.apikey = auth.apikey;
    }

    help(msg) {
        return "Type in ]mod {name} to find a mod. Even a partial name is enough - if you get it wrong, I will try to help you by listing all relevant mods that you might be looking for!";
    }

    shortHelp(msg) {
        return "quick link an Aground mod";
    }

    runInternal(msg, args) {
        let sterm = args.slice(1).join("_");
        ModService.getModLink(this.apikey, sterm, msg);
    }
}

module.exports = ModCommand;
