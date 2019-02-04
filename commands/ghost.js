const Command = require('../command.js');

class GhostCommand extends Command {
    constructor(bot) {
        super(bot,  "Ghost", ['ghost'], 0);
    }

    help(msg) {
        return "Type in ]ghost {message} and I will repeat what you said and remove the original message (if I can). Sneaky, eh?";
    }

    shortHelp(msg) {
        return "used to covertly and cowardly convey conversations";
    }

    runInternal(msg, args) {
        let ghost_msg = args.slice(1).join(" ").replace("@", "");
        msg.delete();
        msg.channel.send(ghost_msg);
    }
}

module.exports = GhostCommand;
