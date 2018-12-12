var Discord = require('discord.js');
var auth = require('./auth.json');
// Initialize Discord Bot
var bot = new Discord.Client({
   autorun: true,
   react: boolean = false
});
bot.on('ready', function (evt) {
    console.log(`Logged in as ${this.user.tag}!`);
});
bot.on('message', function (msg) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    const rip = "512360112820584448";
    const tada = "515935670771122178";
    if (this.react) {
       r = Math.random();
       console.log(r);
      if (r < 0.3) {
          msg.react(tada)
      }
      else if (r < 0.6) {
          msg.react(rip)
      }
    }
    
    if (msg.content.substring(0, 1) == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        switch(cmd) {
            case "react":
              if (msg.author.id != '412352063125717002') {
                msg.reply("Sorry, only gASK can do this!");
              } else {
                this.react = !this.react;
                msg.channel.send('Reactions turned ' + (this.react ? "ON" : "OFF") + "!");
              }
              break;
            case "item":
                if (args.length < 3) {
                    msg.channel.send("Usage: !item {name} {type} [{weight} {cost}]");
                    msg.channel.send("Supported types: food | weapon");
                } else {
                    switch(args[2]) {
                        case "food":                        
                            msg.channel.send('```xml\n<item id="' + args[1] + '" type="food" cost="' + (args.length > 4 ? args[4] : "0") + '" weight="' + (args.length > 3 ? args[3] : "0") + '" icon="' + args[1] + '.ico" />```');
                            break;
                        case "weapon":
                            msg.channel.send('```xml\n<item id="' + args[1] + '" type="equipment" slot="weapon" durability="500" cost="' + (args.length > 4 ? args[4] : "0") + '" weight="' + (args.length > 3 ? args[3] : "0") + '" attack="0" cut="0" stamina="0" knockback="0" icon="' + args[1] + '.ico" animation="' + args[1] + '" action="equip" movement_walk="walk_rswing" critical="false" />```');
                            break;
                    }                                                         
                }
              break;
        }
    }
}); 

bot.login(auth.token);
