const Command = require('../../command.js');
const IdeaService = require('../../services/ideas.js');

class IdeaManipluationCommand extends Command {

    constructor(name, commands, min_args) {
        super(name, commands, min_args);
    }

    runInternal(msg, args) {
        let idea = args.slice(1).join(" ");

        idea = IdeaService.removeUserIdea(msg.author.id, idea);
        if (idea != null) {
            msg.channel.send(this.formatRemoval(idea, msg.author.nickname == null ? msg.author.username : msg.author.nickname));
        } else {
            msg.channel.send("I have no idea what idea you are talking about?");
        }
    }

    formatRemoval(idea, username) {
        return "";
    }
}

module.exports = IdeaManipluationCommand;
