Meteor.publish('SubscribedAspectLists', function () {

    var subs = Subscribtion.find({userId: this.userId});
    var arr=[':)'];
    subs.forEach(function (entry) {
        arr.push(entry.listId)
    });

    return AspectList.find(
        {
            _id: {$in:arr}
        }
    );
});

Meteor.publish('AspectListById', function (id) {
    return AspectList.find({_id:id})
});

Meteor.publish("AspectList", function (options, searchString) {

//console.log(this);
    results = AspectList.find(
        {

            $and:[
                {$or:[
                    {'name' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' }},
                    {'description' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' }}
                ]},
                {
                    $or:[
                        {$and:[
                            {"status": true},
                            {"status": {$exists: true}}
                        ]},
                        {$and:[
                            {owner: this.userId},
                            {owner: {$exists: true}}
                        ]}
                    ]
                }

            ]

        }

        ,options);

    Meteor.users.update(this.userId, {$set: {'profile.numberOfAspectLists': results.count() }});

    return results;
});

Meteor.methods({
    getAspectListCount: function () {
        i = AspectList.find().count()
       // console.log(i);
        return i;
    },

    aspectImageExists: function (name) {
        var fs = Npm.require('fs');
        var clientFilesDir=process.cwd()+"/../web.browser/app/aspects";
        var clientFiles=fs.readdirSync(clientFilesDir);
        var bool = clientFiles.indexOf(name+'.png') > -1;
       // console.log(bool);
        return bool;
   // console.log(clientFiles);
    }

});



