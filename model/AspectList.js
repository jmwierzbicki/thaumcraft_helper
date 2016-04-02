AspectLists = new Mongo.Collection("AspectList");

AspectList = Astro.Class({
    name: 'AspectList',
    collection: AspectLists,
    fields: {
        name:'string',
        description:'string',
        owner:'string',
        ownerName:'string',
        image:'string',
        status:'boolean',
        aspectObs:'array',
        subscriptions:'number',
    }
    });


AspectLists.allow({
    insert: function (userId, aspectList) {
        if(!LoginState.signedUp()){

        return false;
        }
        return userId && aspectList.owner === userId;
    },
    update: function (userId, aspectList, fields, modifier) {
        if(!Meteor.user().emails) return false;
       // console.log(userId);
       // console.log(aspectList);
       // console.log(fields);
        // if (fields.indexOf("status") > -1 && Meteor.user().emails[0].address != 'jmwierzbicki@gmail.com') return false
        //console.log(modifier);
        return userId && aspectList.owner === userId;
    },
    remove: function (userId, aspectList) {
        if(!Meteor.user().emails) return false;
        if(Meteor.user().emails[0].address == 'jmwierzbicki@gmail.com'){
            console.log( Subscribtion.find({listId:aspectList._id }).fetch() );
            Subscribtion.remove({listId:aspectList._id });

            return true
        }

        if(userId && aspectList.owner === userId){
            console.log( Subscribtion.find({listId:aspectList._id }).fetch() );
            Subscribtion.remove({listId:aspectList._id });
            return true;
        }

    }
});