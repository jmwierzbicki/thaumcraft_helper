Comments = new Mongo.Collection("comments"  );


Comments.allow({
    insert: function (userId, comment) {
        //validation
        if ( LoginState.signedUp() === false) {
            return false;
        }

        if(comment.message.length <2 ||
        comment.message.length > 250
        ){

            return false;
        }

        comment.author = Meteor.user().username;
        comment.timestamp = new Date().getTime();
        comment.owner = userId;
        console.log(userId && comment.owner === userId);
        return userId && comment.owner === userId;
    },
    update: function (userId, party, fields, modifier) {
        return false;
    },
    remove: function (userId, comment) {
        console.log(Meteor.user().emails[0].address);
   if(Meteor.user().emails[0].address == 'jmwierzbicki@gmail.com'){
       return true;
   }
    else{
       return userId && comment.owner === userId;
   }
    }
});