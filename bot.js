let Discord = require('discord.js');
let auth = require('./auth.json');
let glob = require( 'glob' );
let path = require( 'path' );
const ModService = require('./services/mods.js');
const SteamService = require('./services/steam.js');

// BOT SETUP
let bot = new Discord.Client({});
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => {});
bot.on('ready', function (evt) {
    console.log(`Logged in as ${this.user.tag}!`);

    console.log("Loading mod stats...");
    ModService.getModStats(auth.apikey, bot);

    console.log("Loading mod comments...");
    ModService.getModComments(auth.apikey, bot);

    //console.log("Loading steam stats...");
    //SteamService.getSteamStats(auth.steam_key,bot);

    setInterval (function () {
        console.log("Loading mod stats...");
        ModService.getModStats(auth.apikey, bot);

        console.log("Loading mod comments...");
        ModService.getModComments(auth.apikey, bot);

        //console.log("Loading steam stats...");
        //SteamService.getSteamStats(auth.steam_key,bot);
    }, 30 * 1000);
});

// MAIN CALLBACK
bot.on('message', function (msg) {
    try {
    // STOP ON OTHER BOTS
    if (msg.author.bot) { return; }

    // SOME GENERIC STUFF
    if (msg.content.toLowerCase().includes("good bot")) {
        msg.channel.send("Thanks! I try my best!");
    } else if (msg.content.toLowerCase().includes("bad bot")) {
        msg.channel.send("Sorry! I try my best! It won't happen again! I promise!");
    } else if (msg.mentions.users.some(user => user.id === bot.user.id)) {
        msg.channel.send("Hello there! You called me? If you wanna know how to interact with me properly, type in `]help` and I will tell you!");
    } else if (msg.includes(':pinched_fingers:')) {
            msg.channel.send('Italian sign language detected. Summoning gASK, please stand-by...');
            bot.users.resolve(412352063125717002).send("You have been summoned in <#" + msg.channelId + ">");        
    } else if (msg.content.substring(0, 1) === ']') {
        // only log commands (duh!)
        console.log(msg.author.id + ": " + msg.content);

        // This is the magic - command parsing!
        let args = msg.content.replace(/@/g,"").substring(1).split(' ');
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
    } catch (error) {
        console.log(error);
        msg.channel.send('BORK! BORK! I AM BORKED! <@412352063125717002> PLZ SEND HELP!');
        // SHOW MUST GO OOOOOOON
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


