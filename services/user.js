class UserService {

    static lookupUser(msg, usernamePart) {
        let found_users = this.lookupUsers(msg,  usernamePart);

        if (found_users.length === 0) {
            msg.channel.send("Sorry, I don't know wnyone called '" + usernamePart + "'.");
            return null;
        } else if (found_users.length > 1) {
            msg.channel.send("Mate, I know **many** people called '" + usernamePart + "'...");
            return null;
        }

        return found_users[0];
    }

    static lookupUsers(msg, usernamePart) {
        let lookup_uname = usernamePart.replace("@", "");
        let found_users = [];

        msg.guild.members.forEach((member) => {
            if ((member.nickname != null && member.nickname.toLowerCase().includes(lookup_uname.toLowerCase()))
                || (member.user.username.toLowerCase().includes(lookup_uname.toLowerCase()))) {
                member.user.nickname = member.nickname;
                found_users.push(member.user);
            }
        });

        return found_users;
    }

    static getUser(msg) {
        return this.lookupUser(msg, msg.author.username);
    }

    static getUsername(user) {
        return user.nickname == null ? user.username : user.nickname;
    }

    static getUsernameFromMessage(msg) {
        return this.getUsername(this.getUser(msg));
    }
}

module.exports = UserService;