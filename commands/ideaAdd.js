const Command = require('../command.js');
const IdeaService = require('../services/ideas.js');
const UserService = require('../services/user.js');

class IdeaAddCommand extends Command {
    constructor() {
        super("Idea Adding", ['idea'], 1);
    }

    help(msg) {
        return "`]idea {IDEA TEXT HERE}` to add a new idea with the `IDEA TEXT HERE` text";
    }

    shortHelp(msg) {
        return "allows adding to user idea list";
    }

    runInternal(msg, args) {
        let idea = args.slice(1).join(" ").replaceAll("@", "");
        let no = IdeaService.addUserIdea(msg.author.id, idea);
        msg.channel.send(idea + "? What a great idea, " + UserService.getUsernameFromMessage(msg) + "! I am saving that for you as idea #" + no + ".");
    }
}

module.exports = IdeaAddCommand;
