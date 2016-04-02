//FS.debug = true;
AspectImages = new FS.Collection("aspectimages", {
    stores: [new FS.Store.FileSystem("original")],
    filter: {
        maxSize: 204800,
        allow: {
            contentTypes: ['image/*']
        }
    }
});

if (Meteor.isServer) {
    AspectImages.allow({
        insert: function (userId) {
            return (userId ? true : false);
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

    Meteor.publish('aspectimages', function(id) {
        return AspectImages.find({_id:id });
    });
}