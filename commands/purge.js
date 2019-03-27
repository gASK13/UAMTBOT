const Command = require('../command.js');

class PurgeCommand extends Command {
    constructor() {
        super("Purge", ['purge'], 1);
    }

    help(msg) {
        return "EXPERIMENTAL COMMAND, DO NOT USE!!!";
    }

    shortHelp(msg) {
        return "EXPERIMENTAL COMMAND, DO NOT USE!!!";
    }

    runInternal(msg, args) {
        if (msg.author.id != '412352063125717002') {
            msg.channel.reply("This is a top secret command, usable by @gASK only (for now)!");
            return;
        }

        if (isNaN(args[1])) {
            msg.channel.reply("How can I remove '" + args[1] + "' messages you smartass?");
            return;
        }

        if (channel.fetchMessages != null) {
            for (oldMsg in channel.fetchMessages({ limit: args[1] })) {
                oldMsg.delete();
            }
        }

        msg.delete();
    }
}

module.exports = PurgeCommand;
