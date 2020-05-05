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
        msg.channel.send("https://fancyfishgames.com/Aground/play/Aground.js");
    }
}

module.exports = JsFileCommand;
