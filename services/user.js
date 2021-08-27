class UserService {

    static lookupUser(msg, usernamePart) {
        let found_users = this.lookupUsers(msg, usernamePart);

        if (found_users.length === 0) {
            msg.channel.send("Sorry, I don't know anyone called '" + usernamePart + "'.");
            return null;
        } else if (found_users.length > 1) {
            msg.channel.send("Mate, I know **many** people called '" + usernamePart + "'...");
            return null;
        }

        return found_users[0];
    }

    static lookupUsers(msg, usernamePart) {
        let lookup_uname = usernamePart;
        let found_users = [];
        let true_user = null;
        
        if (!msg.guild) {            
            return [msg.author];
        }

        msg.guild.members.cache.each((member) => {
            if ((member.nickname != null && member.nickname.toLowerCase().includes(lookup_uname.toLowerCase()))
                || (member.user.username.toLowerCase().includes(lookup_uname.toLowerCase()))) {
                member.user.nickname = member.nickname;
                found_users.push(member.user);
                if (member.nickname === usernamePart || member.user.username === usernamePart) { true_user = member.user; }
            }
        });

        return true_user ? [true_user] : found_users;
    }

    static getUser(msg) {
        return this.lookupUser(msg, msg.author.username);
    }

    static getUsername(user) {
        (user.nickname == null ? user.username : user.nickname).replace(/@/g,"");
    }

    static getUsernameFromMessage(msg) {
        return this.getUsername(this.getUser(msg));
    }
}

module.exports = UserService;
