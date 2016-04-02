Meteor.publish("Subscriptions", function () {
    return Subscribtion.find(
        {
            $and:[
                {"userId": this.userId},
                {"userId": {$exists: true}}
            ]



        });
});