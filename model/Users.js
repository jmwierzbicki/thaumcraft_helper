

Meteor.users.deny({
    update: function(userId, doc) {
        if(userId === doc._id) return false;
        return true;
    }
});