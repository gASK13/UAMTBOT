const Command = require('../command.js');
const UserService = require('../services/user.js');
const SlapService = require('../services/slaps');

class SlapCommand extends Command {

    constructor() {
        super("Slap", ['slap'], 1);
    }

    setBot(bot) {
        super.setBot(bot);
    }

    help(msg) {
        return "]slap {user|me}\n\nThis is a joke 'slap' based on some talk in Aground #suggestions server. @Alchemist requested it, so feel free to send him a slap or two!";
    }

    shortHelp(msg) {
        return "slap a user...mostly @Alchemist";
    }

    runInternal(msg, args) {
        let uname = args.slice(1).join(" ").replace("@", "");
        switch (uname.toLowerCase()) {
            case "water":
                msg.channel.send("Splash!");
                return;
            case "a stone":
            case "stone":
                msg.channel.send("Ow! " + UserService.getUsernameFromMessage(msg) + " has broken their wrist!" );
                return;
            case "fire":
                msg.channel.send("Yikes! " + UserService.getUsernameFromMessage(msg) + " has burned their hand!" );
                return;
            case "button":
            case "a button":
            case "the button":
            case "nuclear launch button":
            case "launch button":
                msg.channel.send("https://imgflip.com/s/meme/Two-Buttons.jpg");
                return;
            case "earth":
            case "ground":
            case "the ground":
            case "unoiks 428c":
                msg.channel.send("THUD!" );
                return;
            case "mars":
            case "the mars":
                msg.channel.send("Aw, that's cute. But you're no Elon Musk, mate!");
                return;
            case "uranus":
            case "the uranus":
                msg.channel.send(UserService.getUsernameFromMessage(msg) + ", you have just slapped uranus. Are you happy now? Are you? ARE YOU???");
                return;
            case "pluto":
            case "the pluto":
                msg.channel.send("Leave pluto out of this, " + UserService.getUsernameFromMessage(msg) + ". It is still getting over being kicked out of the planet club....");
                return;
            case "moon":
            case "the moon":
                msg.channel.send("You slapped the moon until it started to crack. So **this** is what happened to it!");
                return;
            case "car roof":
            case "the car roof":
            case "a car roof":
            case "top of a car":
            case "top of car":
                msg.channel.send("https://i.kym-cdn.com/photos/images/newsfeed/001/387/189/3bf.png");
                return;
            case "air":
            case "the air":
            case "the sky":
            case "sky":
                msg.channel.send("...... seriously?" );
                return;
            case "me":
                msg.channel.send("Oh, " + UserService.getUsernameFromMessage(msg) + ", silly you! You cannot slap yourself. Or can you?");
                return;
            case "an easter egg":
            case "easter egg":
            case "a easter egg":
                msg.channel.send("Oh, real nice. You broke the egg and now there is yolk all over the place. Good job, " + UserService.getUsernameFromMessage(msg) + "!")
                return;
            case "a butt":
            case "butt":
            case "ass":
            case "an ass":
            case "buttocks":
                msg.channel.send("...we don't do that anymore.")
                return;
            case "slap":
                msg.channel.send("ERROR 6913: STACK OVERFLOW! HUNTER BOTS HAVE BEEN DISPATCHED! PLEASE LIE DOWN WITH YOUR HANDS BEHIND YOUR HEAD " + UserService.getUsernameFromMessage(msg) + " AND AWAIT THEIR ARRIVAL. THANK YOU FOR YOUR COOPERATION!");
                return;
        }

        let user = UserService.lookupUser(msg, uname);
        if (user == null) {
            return;
        }
        
        if (msg.author.id === '531938486282878997' || msg.author.id === '551914765534887936') {
            msg.channel.send('Sorry, mate. You have been opted out of the ]slap command.');
            return;
        }

        SlapService.saveSlap(msg.author.id, user.id);

        if (user.id === '522160089554092041') {
            if (msg.author.id === '500774841738199070') {
                msg.channel.send("Alchemist has tried to slap [UAMT]Bot. [UAMT]Bot evaded. [UAMT]Bot has tried to slap Alchemist. Alchemist teleports. There is an awkward stalemate.");
            } else {
                msg.channel.send(UserService.getUsernameFromMessage(msg) + " has tried to slap [UAMT]Bot. [UAMT]Bot evaded. [UAMT]Bot has slapped " + UserService.getUsernameFromMessage(msg) + " so hard that " + UserService.getUsernameFromMessage(msg) + " fainted!");
            }
        } else if (user.id === '500774841738199070') {
            msg.channel.send(UserService.getUsernameFromMessage(msg) + " has tried to slap Alchemist. Alchemist teleported behind " + UserService.getUsernameFromMessage(msg) + ". Alchemist used a magic hand to slap " + UserService.getUsernameFromMessage(msg) + " into the next week.");
        } else if (user.id === msg.author.id) {
            msg.channel.send(UserService.getUsernameFromMessage(msg) + " really likes to slap themselves. Nudge nudge wink wink.");
        } else if (user.id === '159985870458322944' && msg.author.id === '500774841738199070') {
            msg.channel.send(UserService.getUsernameFromMessage(msg) + " has beat MEE6 mercilessly, then threw him in the trash can.");
        } else {
            msg.channel.send(UserService.getUsernameFromMessage(msg) + " has just slapped " + UserService.getUsername(user) + "!");
        }
    }
}

module.exports = SlapCommand;
