var Discord = require('discord.js');
var auth = require('./auth.json');
var https = require("https");
var fs = require("fs");

var ideas = JSON.parse(fs.readFileSync('ideas.json', 'utf8'));

// Initialize Discord Bot
var bot = new Discord.Client({
});
bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => {});
bot.on('ready', function (evt) {
    console.log(`Logged in as ${this.user.tag}!`);
});
bot.on('message', function (msg) {
   if (msg.author.bot) { return; }
   
    if (msg.mentions.users.exists('id', '522160089554092041')) {
       msg.channel.send("Hello there! You called me? If you wanna know how to interact with me properly, type in `]help` and I will tell you!");
    }
    if (msg.content.substring(0, 1) == ']') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];
        switch(cmd) {
            case "ideas":
                if (args[1] == 'clear') {
                    ideas[msg.author.id] = [];
                    msg.channel.send("Forgetting all your ideas. None of them was any good anyway...");
                    break;
                }
                // List them     
                if (!ideas[msg.author.id] || ideas[msg.author.id].length == 0) { msg.channel.send("Sorry, seem like you are out of ideas!"); }
                else {
                    msg.channel.send(msg.author.username +"'s idea list:");
                    let i = 1;
                    let idealist = "";
                    ideas[msg.author.id].forEach(function(element) {
                        idealist += "\n " + (i++) + ".: " + element;
                    });
                    msg.channel.send(idealist);
                }
                break;
            case "finishidea":
            case "finish":
                var finish = true;
            case "remove":
            case "removeidea":
            case "remidea":
                var id = args.slice(1).join(" ");
                if (isNaN(id)) {
                    // convert to number
                    id = ideas[msg.author.id].indexOf(id);
                } else { id -= 1; }
                // remove by id
                var idea = ideas[msg.author.id][id];
                if (ideas[msg.author.id].splice(id,1).length > 0) {
                   if (finish) {
                       msg.channel.send("Good job finally finishing " + idea + ", " + msg.author.username + "!");
                   } else {
                        msg.channel.send(idea + " was not a good one anyway ...");
                   }
                } else {
                    msg.channel.send("I have no idea what idea you are talking about?");
                }                
                fs.writeFile( "ideas.json", JSON.stringify(ideas), "utf8", function(error) {} );
                break;                
            case "idea":
                // Add idea
                if (args.length < 2) { msg.channel.send("Proper usage is ]idea {idea to save}. Got it?"); return; }
                var idea = args.slice(1).join(" ");
                if (!ideas[msg.author.id]) { ideas[msg.author.id] = [] }
                ideas[msg.author.id].push(idea);
                fs.writeFile( "ideas.json", JSON.stringify(ideas), "utf8", function(error) {} );
                msg.channel.send(idea + "? What a great idea, " + msg.author.username + "! I am saving that for you as idea #" + (ideas[msg.author.id].length) + ".");
                break;
           case "help":
              msg.channel.send("Hello there! I am your friendly [UAMT] bot.\nI can provide basic links to mod IO.\nMy prefix is ]\n\n]modlist will link to Aground mod.io page\n]mod {name} will help you search for a mod and link to it.\n]ideas will allow me to list your ideas\n]idea {my idea here} will allow you to store a new idea\n]remove {#} or ]remove {idea} will allow you to remove stupid ideas\n]finish {#} or ]finish {idea} will allow you me to congratulate you on finishing one of your ideas!\n]item will allow you to quickly generate XML for a mod item.");
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
           case "mods":
           case "modlist":
              msg.channel.send("https://aground.mod.io/");
              break;
           case "mod":
              if (args.length < 2) {
                 msg.channel.send("Usage: !mod {search_term}");
              } else {
                 var sterm = args.slice(1).join("_");
                 sterm = encodeURI(sterm);
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
