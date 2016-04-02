//FS.debug = true;
Avatars = new FS.Collection("avatars", {
    stores: [new FS.Store.FileSystem("avatars")],
    filter: {
        maxSize: 604800,
        allow: {
            contentTypes: ['image/*']
        }
    }
});
if (Meteor.isServer) {
    Avatars.allow({

        insert: function (userId, file) {
            if(userId && file.metadata.owner === userId){

                AspectLists.find({owner:userId}).fetch().forEach( (item)=>{

                    item.set('image', file.url({brokenIsFine: true}))

                    item.save();
                });



                Avatars.remove({
                    $and: [
                        {
                            "metadata.owner": userId
                        },
                        {
                            _id: {$ne: file._id}
                        }]
                });
                return true;
            }

            return (false);
        },
        remove: function (userId) {
            return (userId ? true : false);
        },
        download: function () {
            return true;
        },
        update: function (userId) {
            return (userId ? true : false);
        }
    });
    Meteor.publish('avatars', function (id) {
        return Avatars.find({"metadata.owner": id});
    });
}