Meteor.publish("lastChatMessage", function (chatId ) {

        return Comments.find(
            {chatId: chatId},
    { skip: 0, limit: 1, sort: {timestamp: -1}})
});

Meteor.methods({
    commentsCount: function(chatId){
       return Comments.find({chatId: chatId}).count();
    },
   getChatData: function(chatId, lastId) {

       if( lastId===''){
           lastId = new Date().getTime();
       }
      var data = Comments.find(
           {
               $and: [
                   {
                       chatId: chatId
                   },
                   {
                       timestamp:{$lt: lastId}
                   }
               ]
           },
           { skip: 0, limit: 20, sort: {timestamp: -1}});

       return data.fetch();


   }
});