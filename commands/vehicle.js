const Command = require('../command.js');

class VehicleCommand extends Command {
    constructor() {
        super("Vehicle", ['vehicle'], 2);
    }

    help(msg) {
        return "Usage: ]vehicle {name} {type} [{max_weight} {fuel} {health} {defence} {speed}]\");\nSupported types: boat | flying | car | mining  | spaceship | submarine";
    }

    shortHelp(msg) {
        return "provides an easy way to create `<vehicle>` tags";
    }

    runInternal(msg, args) {
        msg.channel.send('```xml\n<vehicle id="' + args[1].replace("@", "") + '" tile="' + args[1].replace("@", "") + '" title="vehicle.' + args[1].replace("@", "") + '" animation="' + args[1].replace("@", "") + '" type="' + (args.length > 2 ? args[2].replace("@", "") : "car") + '" max_weight="' + (args.length > 3 ? args[3].replace("@", "") : "2000") + '" fuel="' + (args.length > 4 ? args[4].replace("@", "") : "1000") + '" health="' + (args.length > 5 ? args[5].replace("@", "") : "1000") + '" defence="' + (args.length > 6 ? args[6].replace("@", "") : "3") + '" speed="' + (args.length > 7 ? args[7].replace("@", "") : "5") + '" icon="' + args[1].replace("@", "") + '.ico">\n\n</vehicle>```');
    }
}

module.exports = VehicleCommand;
