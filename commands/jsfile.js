const Command = require('../command.js');

class JsFileCommand extends Command {
    constructor() {
        super("JS File", ['js', 'jsfile'], 0);
    }

    help(msg) {
        return "Attaches actual Aground JS file.";
    }

    shortHelp(msg) {
        return "provides latest aground js file";
    }

    runInternal(msg, args) {
        //msg.channel.send("https://fancyfishgames.com/Aground/play/Aground.js");
        msg.channel.send("**2.1.1a beta**\nhttps://cdn.discordapp.com/attachments/373987568779395072/764467793059512370/Aground.js");
    }
}

module.exports = JsFileCommand;
