let fs = require("fs");
let ideas = JSON.parse(fs.readFileSync('ideas.json', 'utf8'));

class IdeasService {

    static save() {
        fs.writeFile("ideas.json", JSON.stringify(ideas), "utf8", function (error) {
        });
    }

    static optout(user, optoutFlag) {
        if (ideas['optout'] == null) {
            ideas['optout'] = [];
        }

        if (optoutFlag) {
            if (ideas['optout'].indexOf(user) === -1) { ideas['optout'].push(user); }
        } else {
            let id = ideas['optout'].indexOf(user);
            if (id > -1) { ideas['optout'].splice(id, 1); }
        }

        this.save();
    }

    static isOptout(user) {
        return ideas['optout'] != null && ideas['optout'].indexOf(user) > -1;
    }

    // Returns user ideas - can return NULL
    static getUserIdeas(user) {
        ideas[user] = this.checkNulls(ideas[user]);
        return ideas[user];
    }

    static checkNulls(ideas) {
        return ideas == null ? null : ideas.filter(function (el) {
            return el != null;
        });
    }

    static clearUserIdeas(user) {
        ideas[user] = [];
        this.save();
    }

    // Returns the new idea count
    static addUserIdea(user, idea, borrowedFrom) {
        if (!ideas[user]) {
            ideas[user] = [];
        }
        ideas[user].push(idea);
        // todo borrow mark
        this.save();
        return ideas[user].length;
    }

    // Returns the new idea count
    static borrowUserIdea(user, id, borrowedTo) {
        if (isNaN(id)) {
            // convert to number
            id = ideas[user].indexOf(id);
        } else {
            id -= 1;
        }
        let idea = ideas[user][id];
        // todo borrow mark
        return idea;
    }

    // Returns IDEA if removed; NULL otherwise
    static removeUserIdea(user, id) {
        if (isNaN(id)) {
            // convert to number
            id = ideas[user].indexOf(id);
        } else {
            id -= 1;
        }
        // remove by id
        let idea = ideas[user][id];
        if (idea != null) {
            ideas[user].splice(id, 1);
        }
        this.save();
        return idea;
    }

}

module.exports = IdeasService;
