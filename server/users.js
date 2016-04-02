Meteor.publish("users", function () {
    return Meteor.users.find(
        {_id: this.userId}

    );
});

Meteor.methods({

    'SaveSorting': function(sortMethod, sortDirection ) {

        Meteor.users.update(this.userId, {$set: {'profile.sortMethod': sortMethod}});
        Meteor.users.update(this.userId, {$set: {'profile.sortDirection': sortDirection}});
       // console.log('sorting saved ',this.userId );
    },
    'SaveSolverState': function(state) {
      //  console.log(state);
        Meteor.users.update(this.userId, {$set: {'profile.solverState._id': state}});
        //console.log('sorting saved ',this.userId );
    },
    'changeUsername': function(password, username ){

        if (username.length ==0
        || username.length >= 20){
            return 'Username can be alphanumeric phrase larger than 0 and less than 21 characters'
        }

        if(validatePassword(password)){
            Accounts.setUsername(this.userId, username);
            return 'Username changed!'
        }else{
            return 'Bad Password'
        }

    },
    'changeUserPassword': function(password){
        if(validatePassword(password)){
            return 'Password changed!'
        }else{
            return 'Bad Password'
        }

    },
});
function validatePassword( password){
    if (Meteor.userId()) {
        //console.log(Meteor.user());
        var user = Meteor.user();
        var pwd = {digest: password, algorithm: 'sha-256'};
        var result = Accounts._checkPassword(user, pwd);
        return result.error == null;
    } else {
        console.log('user was null');
        return false;
    }
}

Meteor.methods({
    'testowa': function (string) {
        var i = string;
        console.log(i);
    }
});