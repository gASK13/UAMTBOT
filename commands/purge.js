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
            msg.channel.send("This is a top secret command, usable by @gASK only (for now)!");
            return;
        }

        if (isNaN(args[1])) {
            msg.channel.send("How can I remove '" + args[1] + "' messages you smartass?");
            return;
        }

        // check user rights in this channel (needs delete privileges)

        if (msg.channel.fetchMessages != null) {
            msg.channel.fetchMessages({ limit: args[1] })
                .then(messages => { messages.forEach((m) => m.delete())})
                .catch(console.error);
        }

        msg.delete();
    }
}

module.exports = PurgeCommand;
