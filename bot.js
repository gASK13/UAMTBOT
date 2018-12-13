var Discord = require('discord.js');
var auth = require('./auth.json');
var https = require("https");

// Initialize Discord Bot
var bot = new Discord.Client({
   react: boolean = false
});
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => {});
bot.on('ready', function (evt) {
    console.log(`Logged in as ${this.user.tag}!`);
});
bot.on('message', function (msg) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    const rip = "512360112820584448";
    const tada = "515935670771122178";
    if (this.react && msg.author.id != '522160089554092041') {
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
                msg.channel.send('Reactions are now turned ' + (this.react ? "ON" : "OFF") + "!");
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
           case "mod":
              if (args.length < 2) {
                 msg.channel.send("Usage: !mod {search_term}");
              } else {
                 var sterm = args.slice(1).join("%20");
                 var options = {
                      host: 'api.mod.io',
                      port: 443,
                      path: '/v1/games/34/mods?api_key=' + auth.apikey + "&_q=" + sterm,
                      method: 'GET',
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  };
                 var req = https.request(options, function(res)
                  {
                    var output = '';
                    console.log(options.host + ':' + res.statusCode);
                    res.setEncoding('utf8');

                    res.on('data', function (chunk) {
                        output += chunk;
                    });

                    res.on('end', function() {
                        var obj = JSON.parse(output);
                        if (obj.result_count == 0) {
                           msg.channel.send("Sorry, not mod matching this name was found.");
                        } else if (obj.result_count == 1) {
                           msg.channel.send(obj.data[0].profile_url)
                        } else {
                           var names = "";
                           obj.data.forEach(function(element) { names += (names.length > 0 ? ", " : "") + element.name});
                           msg.channel.send("There are multiple mods matching your name. Did you mean " + names + "?");
                        }
                    });
                });

                req.on('error', function(err) {
                    msg.channel.send("BOT BORKED. BORK BORK.");
                });

                req.end();
              }
              break;
        }
    }
}); 

bot.login(auth.token);
