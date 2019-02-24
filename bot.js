let Discord = require('discord.js');
let auth = require('./auth.json');
let glob = require( 'glob' );
let path = require( 'path' );



// BOT SETUP
let bot = new Discord.Client({});
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => {});
bot.on('ready', function (evt) {
    console.log(`Logged in as ${this.user.tag}!`);
});

// MAIN CALLBACK
bot.on('message', function (msg) {
    // STOP ON OTHER BOTS
    if (msg.author.bot) { return; }

    // SOME GENERIC STUFF
    if (msg.content.toLowerCase().includes("good bot")) {
        msg.channel.send("Thanks! I try my best!");
    } else if (msg.mentions.users.some(user => user.id === bot.user.id)) {
        msg.channel.send("Hello there! You called me? If you wanna know how to interact with me properly, type in `]help` and I will tell you!");
    } else if (msg.content.substring(0, 1) === ']') {
        // This is the magic - command parsing!
        let args = msg.content.substring(1).split(' ');
        let cmd = args[0];

        // Help section
        if (cmd === 'help') {
            if (args.length >= 2) {
                // try to find help for one command
                for (let com of this.commands) {
                    if (com.supports(args[1])) {
                        msg.channel.send("Help for ]" + args[1] + ":\n" + com.help());
                        return;
                    }
                }
            } else {
                let help = "Hello there! I am your friendly [UAMT] bot.\nMy prefix is `]`. My commands are:\n";
                for (let com of this.commands) { help += com.shorlist.map(i => "`" + i + "`").join(" | ") + " - " + com.shortHelp() + "\n"; }
                msg.channel.send(help);
                return;
            }
        }

        // Command execution part
        for (let com of this.commands) {
            if (com.supports(cmd)) {
                com.run(msg, args);
                return;
            }
        }
    }
});

// LOGIN
bot.login(auth.token);

// COMMAND SETUP
bot.commands = [];
glob.sync( './commands/*.js' ).forEach( function( file ) {
    let Command = require( path.resolve( file ) );
    bot.commands.push(new Command());
});
for (let com of bot.commands) {
    com.setBot(bot); com.setAuth(auth);
}
