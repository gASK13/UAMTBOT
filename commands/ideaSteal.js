const Command = require('../command.js');
const IdeaService = require('../services/ideas.js');
const UserService = require('../services/user.js');

class IdeaStealCommand extends Command {
    constructor() {
        super("Idea Steal", ['steal', 'copy', 'borrow'], 2);
    }

    help(msg) {
        return "`]steal {PERSON} {IDEA TEXT or NUMBER}` to 'steal' an idea from person by TEXT or NUMBER. This will **not** actually steal it, just copy it to your idea list and mark the idea as 'stolen' in your list.";
    }

    shortHelp(msg) {
        return "allows stealing ideas from others";
    }

    runInternal(msg, args) {
        let user = UserService.lookupUser(msg, args[1].replace("@", ""));
        let idea = args.slice(2).join(" ").replace("@", "");

        let ideaText = IdeaService.borrowUserIdea(user.id, idea, msg.author.id);
        let no = IdeaService.addUserIdea(msg.author.id, ideaText, user.id);

        msg.channel.send("Sorry, " + UserService.getUsername(user) +idea + "! Seems like " + ideaText + " was too good an idea for " + UserService.getUsernameFromMessage(msg) + " to resist *borrowing* it as their #" + no + "!");
    }
}

module.exports = IdeaStealCommand;
