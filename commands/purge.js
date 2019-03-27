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
        if (msg.author.id != '412352063125717002' && msg.author.id != '352201261971668992') {
            msg.channel.send("This is a top secret command, usable by @gASK or @Airom only (for now)!");
            return;
        }

        if (isNaN(args[1])) {
            msg.channel.send("How can I remove '" + args[1] + "' messages you smartass?");
            return;
        }

        // check user rights in this channel (needs delete privileges)
        msg.guild.fetchMember(msg.author).then(
            member => {
                if (!member.permissionsIn(msg.channel).has("MANAGE_MESSAGES")) {
                    msg.channel.send("Sorry mate, you need to have permission to delete messages. Nice try though...");
                } else {
                    if (msg.channel.fetchMessages != null) {
                        msg.delete();
                        msg.channel.fetchMessages({ limit: args[1] })
                            .then(messages => msg.channel.bulkDelete(messages))
                            .catch(console.error);
                    }
                }
            }
        ).catch(console.error);
    }
}

module.exports = PurgeCommand;
