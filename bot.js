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
            case "age":
                msg.guild.fetchMember(msg.author).then(function(value) {
                    let ms = new Date().getTime() - value.joinedTimestamp;
                    let min = Math.floor(ms / (1000 * 60));
                    let hr = Math.floor(min / 60); min -= hr * 60;
                    let ds = Math.floor(hr / 24); hr -= ds * 24;
                    msg.channel.send("You are a member of this server for " + ((ds > 0) ? (ds + " days, ") : "") + ((ds > 0 || hr > 0) ? (hr + " hours and ") : "") + min + " minutes.");
                });
                break;
            case "ideas":
                let uid = msg.author.id;
                let unm = "you";
                let unma = "you are";
                if (args.length >= 2) {
                    if (args[1] == 'clear' || args[1] == 'clean' || args[1] == 'purge') {
                        ideas[msg.author.id] = [];
                        msg.channel.send("Forgetting all your ideas. None of them was any good anyway...");
                        break;
                    } else {
                        // find user
                        var uname = args.slice(1).join(" ").replace("@", "");          
                        var foundUs = [];
                        msg.guild.members.forEach((member) => {
                            if ((member.nickname != null && member.nickname.toLowerCase().includes(uname.toLowerCase()))
                                || (member.user.username.toLowerCase().includes(uname.toLowerCase()))) {
                                foundUs.push(member.id);
                                unm = member.nickname == null ? member.user.username : member.nickname;
                                unma =  unm + " is";
                            }                                                  
                        });
                        
                        if (foundUs.length == 0) {
                            msg.channel.send("Sorry, I don't know wnyone called '" + uname + "'.");
                            break;
                        } else if (foundUs.length > 1) {
                            msg.channel.send("Mate, I know **many** people called '" + uname + "'...");
                            break;
                        } else {
                            uid = foundUs[0];
                        }
                    }
                }
                // List them     
                if (!ideas[uid] || ideas[uid].length == 0) { 
                    if (uid == 246332093808902144) {
                        msg.channel.send("WOW! " + unm + " so full of ideas I can't even show them all!"); 
                    } else {
                        msg.channel.send("Sorry, seem like " + unma + " out of ideas!"); 
                    }
                }
                else {
                    msg.channel.send(unm +"'s idea list:");
                    let i = 1;
                    let idealist = "";
                    ideas[uid].forEach(function(element) {
                        idealist += "\n " + (i++) + ".: " + element.replace("@", "");
                    });
                    msg.channel.send(idealist);
                }
                break;
            case "finishidea":
            case "finish":
                var finish = true;
            case "remove":
            case "clear":
            case "clean":
            case "removeidea":
            case "remidea":
                var id = args.slice(1).join(" ");
                if (isNaN(id)) {
                    // convert to number
                    id = ideas[msg.author.id].indexOf(id);
                } else { id -= 1; }
                // remove by id
                var idea = ideas[msg.author.id][id];
                if (idea != null && ideas[msg.author.id].splice(id,1).length > 0) {
                   if (finish) {
                       msg.channel.send("Good job finally finishing " + idea.replace("@", "") + ", " + msg.author.username + "!");
                   } else {
                        msg.channel.send(idea.replace("@", "") + " was not a good one anyway ...");
                   }
                } else {
                    msg.channel.send("I have no idea what idea you are talking about?");
                }                
                fs.writeFile( "ideas.json", JSON.stringify(ideas), "utf8", function(error) {} );
                break;                
            case "idea":
                // Add idea
                if (args.length < 2) { msg.channel.send("Proper usage is ]idea {idea to save}. Got it?"); return; }
                var idea = args.slice(1).join(" ").replace("@", "");
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
                            msg.channel.send('```xml\n<item id="' + args[1].replace("@", "") + '" type="food" cost="' + (args.length > 4 ? args[4].replace("@", "") : "0") + '" weight="' + (args.length > 3 ? args[3].replace("@", "") : "0") + '" icon="' + args[1].replace("@", "") + '.ico" />```');
                            break;
                        case "weapon":
                            msg.channel.send('```xml\n<item id="' + args[1].replace("@", "") + '" type="equipment" slot="weapon" durability="500" cost="' + (args.length > 4 ? args[4].replace("@", "") : "0") + '" weight="' + (args.length > 3 ? args[3].replace("@", "") : "0") + '" attack="0" cut="0" stamina="0" knockback="0" icon="' + args[1].replace("@", "") + '.ico" animation="' + args[1].replace("@", "") + '" action="equip" movement_walk="walk_rswing" critical="false" />```');
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
