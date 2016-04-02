Subscribtion = new Mongo.Collection("subscription");


Subscribtion.allow({
    insert: function (userId, object) {
        i = 1;
        if(!LoginState.signedUp()){
        object.guest = true;
        i = 1;
        }
        var dupes = Subscribtion.find({ listId: object.listId, userId:object.userId }).count();
        if(dupes>0) return false;

        var subs = Subscribtion.find({
            $and:[
                {listId: object.listId},
                //{guest: {$exists: false}}
            ]

        });

        //var list = AspectList.findOne(object.listId);
        //            if(!list)return false;

        AspectList.update({_id: object.listId},{  $set: {subscriptions: subs.count()+i} });
        return userId && object.userId === userId;
    },
    update: function (userId, party, fields, modifier) {
        return false;
    },
    remove: function (userId, object) {
        i=1;
        if(!LoginState.signedUp()){
            i = 1;
        }
            var subs = Subscribtion.find({
                $and:[
                    {listId: object.listId},
                    //{guest: {$exists: false}}
                ]
            });
            AspectList.update({_id: object.listId},{  $set: {subscriptions: subs.count()-i} });

            return userId && object.userId === userId;

    }
});